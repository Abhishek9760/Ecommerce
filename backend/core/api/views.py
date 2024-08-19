from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import ProductCategory
from .serializers import ProductCategorySerializer

# import razorpay
from rest_framework.decorators import api_view

from django.conf import settings

# razorpay_client = razorpay.Client(
#     auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET)
# )


# @api_view(["POST"])
# def handle_payment_success(request):
#     order_oid = request.data.get("order_oid")
#     order = api_models.CartOrder.objects.get(oid=order_oid)

#     # request.data is coming from frontend
#     res = json.loads(request.data["response"])

#     """res will be:
#     {'razorpay_payment_id': 'pay_G3NivgSZLx7I9e',
#     'razorpay_order_id': 'order_G3NhfSWWh5UfjQ',
#     'razorpay_signature': '76b2accbefde6cd2392b5fbf098ebcbd4cb4ef8b78d62aa5cce553b2014993c0'}
#     this will come from frontend which we will use to validate and confirm the payment
#     """

#     ord_id = ""
#     raz_pay_id = ""
#     raz_signature = ""

#     # res.keys() will give us list of keys in res
#     for key in res.keys():
#         if key == "razorpay_order_id":
#             ord_id = res[key]
#         elif key == "razorpay_payment_id":
#             raz_pay_id = res[key]
#         elif key == "razorpay_signature":
#             raz_signature = res[key]

#     # get order by payment_id which we've created earlier with isPaid=False
#     # order = order.objects.get(order_payment_id=ord_id)

#     # we will pass this whole data in razorpay client to verify the payment
#     data = {
#         "razorpay_order_id": ord_id,
#         "razorpay_payment_id": raz_pay_id,
#         "razorpay_signature": raz_signature,
#     }

#     # client = razorpay.Client(auth=(env('PUBLIC_KEY'), env('SECRET_KEY')))

#     # checking if the transaction is valid or not by passing above data dictionary in
#     # razorpay client if it is "valid" then check will return None
#     check = razorpay_client.utility.verify_payment_signature(data)

#     if False:
#         print(check)
#         print("Redirect to error url or error page")
#         return Response({"error": "Something went wrong"})

#     # if payment is successful that means check is None then we will turn isPaid=True
#     order.payment_status = "Paid"
#     order.save()

#     res_data = {"message": "payment successfully received!"}

#     return Response(res_data)


# @api_view(["POST"])
# def start_payment(request):
#     # request.data is coming from frontend
#     order_oid = request.data.get("order_oid")
#     order = api_models.CartOrder.objects.get(oid=order_oid)
#     amount = order.total
#     name = request.data["name"]

#     # create razorpay order
#     payment = razorpay_client.order.create(
#         {"amount": int(amount) * 100, "currency": "INR", "payment_capture": "1"}
#     )

#     order.razorpay_order_id = payment.get("id")
#     order.save()

#     data = {"payment": payment, "order": order_oid}
#     return Response(data)


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
