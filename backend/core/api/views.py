from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import ProductCategory, Size
from .serializers import ProductCategorySerializer, SizeSerializer


class FilterOptionsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        categories = ProductCategory.objects.all()
        sizes = Size.objects.all()

        # Serialize the data
        category_serializer = ProductCategorySerializer(categories, many=True)
        size_serializer = SizeSerializer(sizes, many=True)
        print(category_serializer.data)

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
            {
                "id": "sizes",
                "name": "Sizes",
                "options": [
                    {"value": size["id"], "label": size["name"]}
                    for size in size_serializer.data
                ],
            },
        ]

        return Response(response_data)
