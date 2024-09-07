from django.contrib import admin

from .models import (
    CustomUser,
    Address,
    Cart,
    Order,
    Product,
    ProductCategory,
    CartItem,
    ProductJourney,
    SubCategory,
)

admin.site.register(Address)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Product)
admin.site.register(ProductCategory)
admin.site.register(SubCategory)
admin.site.register(CartItem)
admin.site.register(ProductJourney)

# Register your models here.
admin.site.register(CustomUser)
