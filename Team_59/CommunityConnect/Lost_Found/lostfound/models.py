from django.db import models

class LostItem(models.Model):
    object_name = models.CharField(max_length=100)
    founder_name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15)
    # founder_email = models.EmailField(max_length=254, default='default@example.com')  # Add a default value
    description = models.TextField()
    colors = models.CharField(max_length=200, blank=True, null=True)
    brand_name = models.CharField(max_length=100, blank=True, null=True)
    where_found = models.CharField(max_length=200)
    date_found = models.DateField()
    time_found = models.CharField(max_length=8)  # Stores "HH:MM AM/PM"
    place_of_collection = models.CharField(max_length=200)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.object_name

class ItemImage(models.Model):
    lost_item = models.ForeignKey(LostItem, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='item_images/')

    def __str__(self):
        return f"Image for {self.lost_item.object_name}"

class Claim(models.Model):
    lost_item = models.ForeignKey(LostItem, on_delete=models.CASCADE)
    claimant_name = models.CharField(max_length=100)
    proof = models.FileField(upload_to='claim_proofs/')
    message = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Claim for {self.lost_item.object_name} by {self.claimant_name}"