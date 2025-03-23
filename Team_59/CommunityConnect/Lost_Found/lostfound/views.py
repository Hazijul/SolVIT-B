from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .forms import LostItemForm, ClaimForm
from .models import LostItem, ItemImage
import base64
from io import BytesIO
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.contrib.auth import authenticate, logout, login as auth_login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import os

def index(request):
    return render(request, 'index.html')

def main(request):
    return render(request, 'main.html')

def local_service(request):
    return render(request, 'local_service.html')

def index_exchange(request):
    return render(request, 'index_exchange.html')

def about(request):
    return render(request, 'about.html')

def add_listing(request):
    return render(request, 'add-listing.html')

def dashboard(request):
    return render(request, 'dashboard.html')

def contact(request):
    return render(request, 'contact.html')

def marketplace(request):
    return render(request, 'marketplace.html')

def profile(request):
    return render(request, 'profile.html')


def upload(request):
    if request.method == 'POST':
        form = LostItemForm(request.POST)
        if form.is_valid():
            instance = form.save()
            # Handle multiple file uploads
            if 'images' in request.FILES:
                for image in request.FILES.getlist('images'):
                    ItemImage.objects.create(lost_item=instance, image=image)
            # Handle captured images if provided
            if 'capturedImage' in request.POST and request.POST['capturedImage']:
                captured_images = request.POST['capturedImage'].split(';')
                for idx, image_data in enumerate(captured_images):
                    if image_data and ',' in image_data:  # Check if valid base64 data URL
                        try:
                            encoded_data = image_data.split(',')[1]  # Extract base64 part
                            image_file = ContentFile(base64.b64decode(encoded_data), name=f'captured_image_{idx}.png')
                            ItemImage.objects.create(lost_item=instance, image=image_file)
                        except (IndexError, ValueError, base64.binascii.Error) as e:
                            print(f"Error processing captured image {idx}: {str(e)}")
                            continue  # Skip invalid images
            return redirect('found')
    else:
        form = LostItemForm()
    return render(request, 'upload.html', {'form': form})

def found(request):
    items = LostItem.objects.all().order_by('-uploaded_at')
    return render(request, 'found.html', {'items': items})

def claim_item(request, item_id):
    item = get_object_or_404(LostItem, id=item_id)
    if request.method == 'POST':
        form = ClaimForm(request.POST, request.FILES)
        if form.is_valid():
            claim = form.save(commit=False)
            claim.item = item
            claim.save()
            send_mail(
                subject=f"Claim Request for {item.object_name}",
                message=f"{claim.claimant_name} has claimed your item '{item.object_name}'.\nMessage: {claim.message}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[item.mobile_number + '@example.com'],
                fail_silently=False,
            )
            return redirect('found')
    else:
        form = ClaimForm()
    return render(request, 'found.html', {'form': form, 'item': item, 'items': LostItem.objects.all()})

def delete_item(request, item_id):
    item = get_object_or_404(LostItem, id=item_id)
    if request.method == 'POST':
        item.delete()
        return redirect('found')
    return redirect('found')


# - Register a user
def SignupPage(request):
    if request.method=='POST':
        uname = request.POST.get('username')
        email = request.POST.get('email')
        pass1 = request.POST.get('password1')
        pass2 = request.POST.get('password2')

        if pass1 != pass2:
            return JsonResponse({"error": "Your password and confirm password are not the same!"}, status=400)
        else:
            my_user = User.objects.create_user(uname, email, pass1)
            my_user.save()
            return JsonResponse({"success": "User created successfully!"}, status=201)
    return render(request, 'signup.html')

def LoginPage(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        pass1 = request.POST.get('pass')
        user = authenticate(request, username=username, password=pass1)
        
        if user is not None:
            auth_login(request, user)
            return JsonResponse({"success": "Login successful!"}, status=200)
        else:
            return JsonResponse({"error": "Username or Password is incorrect!"}, status=400)

    return render(request, 'login.html')

@csrf_exempt  # Allows logging out via POST request (optional but useful)
def LogoutPage(request):
    if request.method == "POST":  # Ensures logout happens only via POST
        logout(request)
    return redirect('/')