from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from lostfound import views  # Import views from your app (adjust if different)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('lostfound.urls')),  # Include app-specific URLs

]
