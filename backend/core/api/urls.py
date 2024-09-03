# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import (
    CustomUserViewSet,
    ProductCategoryViewSet,
    ProductViewSet,
    CartViewSet,
    AddressViewSet,
    OrderViewSet,
    ProductJourneyViewSet,
)
from .views import FilterOptionsAPIView, start_payment, handle_payment_success

router = DefaultRouter()
router.register(r"users", CustomUserViewSet)
router.register(r"categories", ProductCategoryViewSet)
router.register(r"products", ProductViewSet)
router.register(r"carts", CartViewSet)
router.register(r"addresses", AddressViewSet)
router.register(r"orders", OrderViewSet)
router.register(r"product-journeys", ProductJourneyViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("filters/", FilterOptionsAPIView.as_view()),
    path("razorpay/pay/", start_payment, name="payment"),
    path("razorpay/payment/success/", handle_payment_success, name="payment_success"),
]
