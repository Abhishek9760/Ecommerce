# viewsets.py
from rest_framework import viewsets
from core.models import (
    CustomUser,
    ProductCategory,
    Size,
    Product,
    Cart,
    Address,
    Order,
)
from .serializers import (
    CustomUserSerializer,
    ProductCategorySerializer,
    SizeSerializer,
    ProductSerializer,
    CartSerializer,
    AddressSerializer,
    OrderSerializer,
)


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def perform_create(self, serializer):
        # Get the password from the validated data
        password = self.request.data.get("password")
        # Create the user instance without saving it to the database yet
        user = serializer.save()
        if password:
            # Set the user's password
            user.set_password(password)
            # Save the user with the hashed password
            user.save()


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class SizeViewSet(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
