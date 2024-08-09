# serializers.py
from rest_framework import serializers
from core.models import (
    CustomUser,
    ProductCategory,
    Product,
    Cart,
    Address,
    Order,
    CartItem,
    ProductJourney,
)


class ProductJourneySerializer(serializers.ModelSerializer):
    from_name = serializers.SerializerMethodField()
    to_name = serializers.SerializerMethodField()

    class Meta:
        model = ProductJourney
        fields = "__all__"

    def get_from_name(self, obj):
        # Ensure `from_user` exists and has a `name` attribute
        if obj.from_user and hasattr(obj.from_user, "full_name"):
            return obj.from_user.full_name
        return None

    def get_to_name(self, obj):
        # Ensure `from_user` exists and has a `name` attribute
        if obj.to_user and hasattr(obj.from_user, "full_name"):
            return obj.to_user.full_name
        return None


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = "__all__"
        depth = 2


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "is_ngo", "full_name"]


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField()

    class Meta:
        model = Product
        fields = "__all__"

    def create(self, validated_data):
        # Extract category name from validated data
        category_name = validated_data.pop("category")
        # user = validated_data.pop("user")
        # user = CustomUser.objects.get(pk=user_id)
        # Fetch or create ProductCategory instance
        category, created = ProductCategory.objects.get_or_create(
            name=category_name.lower()
        )
        # Create the Product instance
        product = Product.objects.create(category=category, **validated_data)
        print(product.active, validated_data)
        return product

    def update(self, instance, validated_data):
        category_name = validated_data.pop("category", None)
        if category_name:
            category, created = ProductCategory.objects.get_or_create(
                name=category_name
            )
            instance.category = category

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CartSerializer(serializers.ModelSerializer):
    products = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = "__all__"


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    shipping_address = AddressSerializer()
    cart = CartSerializer()

    class Meta:
        model = Order
        fields = "__all__"


class ProductItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    # quantity = serializers.IntegerField()


class CartUpdateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    products = ProductItemSerializer(many=True)
