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
    SubCategory,
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


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = "__all__"


class ProductCategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = ProductCategory
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    subcategory = serializers.CharField()
    category = serializers.CharField()

    class Meta:
        model = Product
        fields = "__all__"

    def create(self, validated_data):
        subcategory_name = validated_data.pop("subcategory")
        category = validated_data.pop("category")

        category, created = ProductCategory.objects.get_or_create(name=category.lower())
        # Fetch or create SubCategory instance
        subcategory, created = SubCategory.objects.get_or_create(
            name=subcategory_name.lower(), category=category
        )

        # Create the Product instance
        product = Product.objects.create(
            subcategory=subcategory, category=category, **validated_data
        )
        return product

    def update(self, instance, validated_data):
        subcategory_name = validated_data.pop("subcategory", None)
        if subcategory_name:
            subcategory, created = SubCategory.objects.get_or_create(
                name=subcategory_name
            )
            instance.subcategory = subcategory

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
    cart = CartSerializer()

    class Meta:
        model = Order
        fields = "__all__"
        depth = 2


class ProductItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    # quantity = serializers.IntegerField()


class CartUpdateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    products = ProductItemSerializer(many=True)
