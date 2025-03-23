# lostfound/urls.py
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from . import views

urlpatterns = [
    path('', views.main, name='index'),  # Root URL
    path('index/', views.index, name='index'),
    path('local_service/', views.local_service, name='local_service'),
    path('upload/', views.upload, name='upload'),
    path('found/', views.found, name='found'),
    path('index_exchange/', views.index_exchange, name='index_exchange'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('add_listing/', views.add_listing, name='add_listing'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('marketplace/', views.marketplace, name='marketplace'),
    path('profile/', views.profile, name='profile'),
    path('claim/<int:item_id>/', views.claim_item, name='claim_item'),
    path('delete/<int:item_id>/', views.delete_item, name='delete_item'),
    path('login/', views.LoginPage, name='login'),
    path('logout/', views.LogoutPage, name='logout'),
    path('signup/', views.SignupPage, name='signup'),
]

# Serve static and media files only in DEBUG mode
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Serve static files in production (optional, ideally handled by a web server)
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    ]