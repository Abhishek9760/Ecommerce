# serializers.py
from rest_framework import serializers
from core.models import (
    CustomUser,
    ProductCategory,
    Size,
    Product,
    Cart,
    Address,
    Order,
)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "is_ngo"]


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ["id", "name"]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["id", "name"]


class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer()
    sizes = SizeSerializer(many=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "category",
            "quantity",
            "sizes",
            "image",
            "featured",
        ]


class CartSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "products", "subtotal", "total", "updated", "timestamp"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "name",
            "nickname",
            "address_line_1",
            "city",
            "country",
            "state",
            "postal_code",
        ]


class OrderSerializer(serializers.ModelSerializer):
    shipping_address = AddressSerializer()
    cart = CartSerializer()

    class Meta:
        model = Order
        fields = [
            "id",
            "order_id",
            "shipping_address",
            "shipping_address_final",
            "cart",
            "status",
            "shipping_total",
            "total",
            "active",
            "updated",
            "timestamp",
        ]
