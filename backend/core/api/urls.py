# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import (
    CustomUserViewSet,
    ProductCategoryViewSet,
    SizeViewSet,
    ProductViewSet,
    CartViewSet,
    AddressViewSet,
    OrderViewSet,
)
from .views import FilterOptionsAPIView

router = DefaultRouter()
router.register(r"users", CustomUserViewSet)
router.register(r"categories", ProductCategoryViewSet)
router.register(r"sizes", SizeViewSet)
router.register(r"products", ProductViewSet)
router.register(r"carts", CartViewSet)
router.register(r"addresses", AddressViewSet)
router.register(r"orders", OrderViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("filters/", FilterOptionsAPIView.as_view()),
]
