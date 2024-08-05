# viewsets.py
from rest_framework import viewsets
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
from .serializers import (
    CustomUserSerializer,
    ProductCategorySerializer,
    ProductSerializer,
    CartSerializer,
    AddressSerializer,
    OrderSerializer,
    CartUpdateSerializer,
    ProductJourneySerializer,
)

from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def perform_create(self, serializer):
        password = self.request.data.get("password")
        user = serializer.save()
        if password:
            user.set_password(password)
            user.save()


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class ProductJourneyViewSet(viewsets.ModelViewSet):
    queryset = ProductJourney.objects.all()
    serializer_class = ProductJourneySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(active=True)
    serializer_class = ProductSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ["user", "bought"]

    @action(detail=False, methods=["post"], url_path="claim")
    def claim(self, request):
        product_id = request.data.get("product_id")
        bought_by_id = request.data.get("bought_by")

        # Validate inputs
        if not product_id or not bought_by_id:
            return Response(
                {"error": "product_id and bought_by are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch product and user
        product = get_object_or_404(Product, id=product_id)
        bought_by = get_object_or_404(CustomUser, id=bought_by_id)

        # Check if product is already bought
        if product.bought:
            return Response(
                {"error": "Product is already claimed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the product's bought status
        product.bought = True
        product.user = bought_by
        product.save()

        # Create a ProductJourney entry
        ProductJourney.objects.create(to="user", to_user=bought_by, product=product)

        return Response(
            {"status": "Product claimed successfully"}, status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["post"], url_path="donate")
    def donate(self, request):
        product_id = request.data.get("product_id")
        name = request.data.get("name")
        phone = request.data.get("phone")
        address = request.data.get("address")

        # Validate inputs
        if not product_id or not name or not phone or not address:
            return Response(
                {"error": "product_id, name, phone, and address are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Fetch product
        product = get_object_or_404(Product, id=product_id)

        # Check if product is already bought
        if not product.active:
            return Response(
                {"error": "Product is already claimed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the product's bought status
        product.active = False
        product.save()

        cart_obj = Cart.objects.get()

        # Create a ProductJourney entry
        ProductJourney.objects.create(
            to="other", address=address, name=name, phone=phone, product=product
        )

        return Response(
            {"status": "Product donated successfully"}, status=status.HTTP_200_OK
        )


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    filterset_fields = [
        "user",
    ]

    @action(detail=False, methods=["post"], url_path="add-to-cart")
    def add_to_cart(self, request):
        data = request.data
        data["user_id"] = request.user.pk
        print(data)
        serializer = CartUpdateSerializer(data=data)
        if serializer.is_valid():
            user_id = serializer.validated_data["user_id"]
            products_data = serializer.validated_data["products"]

            # Get or create the cart for the user
            cart, created = Cart.objects.get_or_create(user_id=user_id)

            for item in products_data:
                product_id = item["id"]
                quantity = item["quantity"]

                # Check if the product is already in the cart
                cart_item, created = CartItem.objects.get_or_create(
                    product_id=product_id, defaults={"quantity": quantity}
                )

                if not created:
                    # If the CartItem already exists, update the quantity
                    cart_item.quantity += quantity
                    cart_item.save()

                # Add the CartItem to the Cart if it's not already there
                if cart.products.filter(id=cart_item.id).count() == 0:
                    cart.products.add(cart_item)

            # Recalculate subtotal and total
            cart.subtotal = sum(
                item.product.price * item.quantity for item in cart.products.all()
            )

            cart.total = cart.subtotal  # Assuming no additional charges for simplicity
            cart.save()

            return Response(
                {"status": "items added to cart"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="remove-from-cart")
    def remove_from_cart(self, request):
        user_id = request.user.pk
        product_id = request.data.get("product_id")

        if not user_id or not product_id:
            return Response(
                {"error": "user_id and product_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Get the cart for the user
            cart = Cart.objects.get(user_id=user_id)
        except Cart.DoesNotExist:
            return Response(
                {"error": "Cart not found for this user"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            # Get the CartItem to be removed
            print(product_id, cart)
            cart_item = cart.products.get(product__pk=product_id)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Product not found in the cart"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Remove the CartItem from the Cart
        cart.products.remove(cart_item)
        cart_item.delete()  # Optionally delete the CartItem if it is not used elsewhere

        # Recalculate subtotal and total
        cart.subtotal = sum(
            item.product.price * item.quantity for item in cart.products.all()
        )
        cart.total = cart.subtotal  # Assuming no additional charges for simplicity
        cart.save()

        return Response({"status": "item removed from cart"}, status=status.HTTP_200_OK)


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
