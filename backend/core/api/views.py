from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import ProductCategory
from .serializers import ProductCategorySerializer


class FilterOptionsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        categories = ProductCategory.objects.all()
        category_serializer = ProductCategorySerializer(categories, many=True)

        # Format the response
        response_data = [
            {
                "id": "category",
                "name": "Category",
                "options": [
                    {"value": category["id"], "label": category["name"]}
                    for category in category_serializer.data
                ],
            },
        ]

        return Response(response_data)
