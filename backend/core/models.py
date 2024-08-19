from django.db import models
from django.contrib.auth.models import AbstractUser

import os, random
from django.db.models.signals import pre_save, post_save, m2m_changed
from decimal import Decimal


# Create your models here.
class CustomUser(AbstractUser):

    is_ngo = models.BooleanField(default=False)
    full_name = models.CharField(max_length=255)

    class Meta:
        db_table = "users"


class ProductCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.name


# class Size(models.Model):
#     name = models.CharField(max_length=50)

#     def __str__(self) -> str:
#         return self.name


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
    user = models.ForeignKey(
        to=CustomUser, null=True, blank=True, on_delete=models.CASCADE
    )
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(to=ProductCategory, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_image_path, null=True, blank=True)
    featured = models.BooleanField(default=False)
    bought = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    # quantity = models.PositiveIntegerField()


class Cart(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True
    )
    products = models.ManyToManyField(CartItem, blank=True)
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


class Order(models.Model):
    email = models.EmailField(null=True)
    address = models.TextField(null=True)
    company = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=True)
    state = models.CharField(max_length=255, null=True)
    postalcode = models.CharField(max_length=20, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.email}"


class ProductJourney(models.Model):
    from_user = models.ForeignKey(
        to=CustomUser,
        related_name="from_user",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    address = models.CharField(max_length=250)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    to_user = models.ForeignKey(
        to=CustomUser,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="to_user",
    )
    product = models.ForeignKey(
        to=Product, on_delete=models.CASCADE, null=True, blank=True
    )
    action = models.CharField(
        choices=(("buy", "buy"), ("donate", "donate"), ("claim", "claim")),
        max_length=255,
    )


def m2m_changed_cart_receiver(sender, instance, action, *args, **kwargs):
    if action == "post_add" or action == "post_remove" or action == "post_clear":
        products = instance.products.all()
        total = 0
        for x in products:
            total += x.product.price
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
