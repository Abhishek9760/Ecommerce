from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import ProductCategory, Cart, Order, ProductJourney, SubCategory
from .serializers import ProductCategorySerializer, SubCategorySerializer


import razorpay
import json
from rest_framework.decorators import api_view

from django.conf import settings

razorpay_client = razorpay.Client(
    auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET)
)


@api_view(["POST"])
def handle_payment_success(request):
    order_oid = request.data.get("order_oid")
    # print(request.POST)

    # request.data is coming from frontend
    res = json.loads(request.data["response"])

    order = Order.objects.get(order_payment_id=res.get("razorpay_order_id"))
    """res will be:
    {'razorpay_payment_id': 'pay_G3NivgSZLx7I9e',
    'razorpay_order_id': 'order_G3NhfSWWh5UfjQ',
    'razorpay_signature': '76b2accbefde6cd2392b5fbf098ebcbd4cb4ef8b78d62aa5cce553b2014993c0'}
    this will come from frontend which we will use to validate and confirm the payment
    """

    ord_id = ""
    raz_pay_id = ""
    raz_signature = ""

    # res.keys() will give us list of keys in res
    for key in res.keys():
        if key == "razorpay_order_id":
            ord_id = res[key]
        elif key == "razorpay_payment_id":
            raz_pay_id = res[key]
        elif key == "razorpay_signature":
            raz_signature = res[key]

    # get order by payment_id which we've created earlier with isPaid=False
    # order = order.objects.get(order_payment_id=ord_id)

    # we will pass this whole data in razorpay client to verify the payment
    data = {
        "razorpay_order_id": ord_id,
        "razorpay_payment_id": raz_pay_id,
        "razorpay_signature": raz_signature,
    }

    # client = razorpay.Client(auth=(env('PUBLIC_KEY'), env('SECRET_KEY')))

    # checking if the transaction is valid or not by passing above data dictionary in
    # razorpay client if it is "valid" then check will return None
    check = razorpay_client.utility.verify_payment_signature(data)
    print(check, "----")

    if False:
        print(check)
        print("Redirect to error url or error page")
        return Response({"error": "Something went wrong"})

    # if payment is successful that means check is None then we will turn isPaid=True
    order.isPaid = True
    order.save()
    products = order.cart.products.all()
    for p in products:
        prod = p.product
        obj = ProductJourney()
        obj.from_user = prod.user
        obj.to_user = request.user
        obj.product = prod
        obj.action = "buy"
        obj.save()

        prod.user = request.user
        prod.bought = True
        prod.save()

    res_data = {"message": "payment successfully received!"}

    return Response(res_data)


@api_view(["POST"])
def start_payment(request):
    if not request.user.is_authenticated:
        return Response({"message": "Not authorized"}, status=401)
    cart = Cart.objects.get(user=request.user)
    amount = cart.total
    email = request.POST.get("email")
    company = request.POST.get("company")
    address = request.POST.get("address")
    city = request.POST.get("city")
    state = request.POST.get("state")
    postalcode = request.POST.get("postalcode")
    order = Order(
        amount=amount,
        email=email,
        company=company,
        address=address,
        city=city,
        state=state,
        postalcode=postalcode,
        cart=cart,
    )
    print(request.POST)

    # create razorpay order
    payment = razorpay_client.order.create(
        {"amount": int(amount) * 100, "currency": "INR", "payment_capture": "1"}
    )

    order.order_payment_id = payment.get("id")
    # order.isPaid = True
    order.save()

    data = {"payment": payment, "order": order.order_payment_id}
    return Response(data)


class FilterOptionsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch all categories with their related subcategories
        categories = ProductCategory.objects.prefetch_related("subcategories").all()

        # Serialize the categories including subcategories
        category_serializer = ProductCategorySerializer(categories, many=True)

        # Format the response data
        response_data = [
            {
                "id": "category",
                "name": "Category",
                "options": [
                    {
                        "value": category["id"],
                        "label": category["name"],
                        "subcategories": [
                            {"value": subcategory["id"], "label": subcategory["name"]}
                            for subcategory in category["subcategories"]
                        ],
                    }
                    for category in category_serializer.data
                ],
            },
        ]

        return Response(response_data)
