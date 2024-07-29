from django.db import models
from django.contrib.auth.models import AbstractUser

import os, random
from django.db.models.signals import pre_save, post_save, m2m_changed
from decimal import Decimal


# Create your models here.
class CustomUser(AbstractUser):

    is_ngo = models.BooleanField(default=False)

    class Meta:
        db_table = "users"


class ProductCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.name


class Size(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name


def get_filename_ext(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    return name, ext


def upload_image_path(instance, filename):
    # print(instance)
    # print(filename)
    new_filename = random.randint(1, 3910209312)
    name, ext = get_filename_ext(filename)
    final_filename = "{new_filename}{ext}".format(new_filename=new_filename, ext=ext)
    return "products/{new_filename}/{final_filename}".format(
        new_filename=new_filename, final_filename=final_filename
    )


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(to=ProductCategory, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    sizes = models.ManyToManyField(to=Size, blank=True)
    image = models.ImageField(upload_to=upload_image_path, null=True, blank=True)
    featured = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name


class Cart(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True
    )
    products = models.ManyToManyField(Product, blank=True)
    subtotal = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class Address(models.Model):
    name = models.CharField(
        max_length=120, null=True, blank=True, help_text="Shipping to? Who is it for?"
    )
    nickname = models.CharField(
        max_length=120, null=True, blank=True, help_text="Internal Reference Nickname"
    )
    address_line_1 = models.CharField(max_length=120)
    city = models.CharField(max_length=120)
    country = models.CharField(max_length=120, default="United States of America")
    state = models.CharField(max_length=120)
    postal_code = models.CharField(max_length=120)


ORDER_STATUS_CHOICES = (
    ("created", "Created"),
    ("paid", "Paid"),
    ("shipped", "Shipped"),
    ("refunded", "Refunded"),
)


class Order(models.Model):
    order_id = models.CharField(max_length=120, blank=True)  # AB31DE3
    shipping_address = models.ForeignKey(
        Address,
        related_name="shipping_address",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    shipping_address_final = models.TextField(blank=True, null=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=120, default="created", choices=ORDER_STATUS_CHOICES
    )
    shipping_total = models.DecimalField(default=5.99, max_digits=100, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    active = models.BooleanField(default=True)
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)


def m2m_changed_cart_receiver(sender, instance, action, *args, **kwargs):
    if action == "post_add" or action == "post_remove" or action == "post_clear":
        products = instance.products.all()
        total = 0
        for x in products:
            total += x.price
        if instance.subtotal != total:
            instance.subtotal = total
            instance.save()


m2m_changed.connect(m2m_changed_cart_receiver, sender=Cart.products.through)


def pre_save_cart_receiver(sender, instance, *args, **kwargs):
    if instance.subtotal > 0:
        instance.total = Decimal(instance.subtotal) * Decimal(1.08)  # 8% tax
    else:
        instance.total = 0.00


pre_save.connect(pre_save_cart_receiver, sender=Cart)
