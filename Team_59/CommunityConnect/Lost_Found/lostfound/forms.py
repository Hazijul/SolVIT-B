from django import forms
from .models import LostItem, Claim
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.forms.widgets import PasswordInput, TextInput

class LostItemForm(forms.ModelForm):
    colors = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Enter colors (e.g., Red, Blue)'})
    )
    time_found = forms.CharField(max_length=5, required=True)  # HH:MM format
    time_found_ampm = forms.ChoiceField(choices=[('AM', 'AM'), ('PM', 'PM')])

    class Meta:
        model = LostItem
        fields = [
            'object_name', 'founder_name', 'mobile_number', 'description',
            'colors', 'brand_name', 'where_found', 'date_found', 'time_found',
            'time_found_ampm', 'place_of_collection'
        ]

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.time_found = f"{self.cleaned_data['time_found']} {self.cleaned_data['time_found_ampm']}"
        instance.colors = self.cleaned_data['colors']  # No need to join, it's already a string
        if commit:
            instance.save()
        return instance

class ClaimForm(forms.ModelForm):
    class Meta:
        model = Claim
        fields = ['claimant_name', 'proof', 'message']


# - Register/Create a user

class CreateUserForm(UserCreationForm):

    class Meta:

        model = User
        fields = ['username', 'password1', 'password2']


# - Login a user

class LoginForm(AuthenticationForm):

    username = forms.CharField(widget=TextInput())
    password = forms.CharField(widget=PasswordInput())