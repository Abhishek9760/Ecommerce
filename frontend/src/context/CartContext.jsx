import React, { createContext, useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { baseUrl } from "../constants";
import { apiInstance } from "../utils/axios";

export const CartContext = createContext([]);

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const { user } = useContext(UserContext);

  const loadCart = async (userid) => {
    await fetch(`${baseUrl}/carts/?user=${userid}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data?.length === 1) {
          data = data[0];
          data?.products.forEach((item) => {
            item.id = item.product.id;
          });
          setTotal(data?.total);
          setSubtotal(data?.subtotal);
          setCart(data?.products);
        }
      });
  };

  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

   const handlePaymentSuccess = async (response) => {
    try {
      console.log("success called");
      console.log(response);
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));
      // bodyData.append("order_oid", order?.oid);

      await apiInstance
        .post("razorpay/payment/success/", bodyData, {
          
          headers: { Authorization: `Bearer ${user?.token}` },
        })
        .then((res) => {
          console.log("Everything is OK!");
          window.location.href = "/";
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
  };


  const showRazorpay = async (bodyData) => {
    const userId = user?.user?.id;

    bodyData.append("userid", userId)
    bodyData.append("amount", total.toString());

    const response = await apiInstance.post(`/razorpay/pay/`,bodyData,{headers: {Authorization: `Bearer ${user?.token}`}});
    console.log(response);
    
    const data = response;
  


    var options = {
      key_id: import.meta.env.REACT_APP_PUBLIC_KEY, // in react your environment variable must start with REACT_APP_
      key_secret: import.meta.env.REACT_APP_SECRET_KEY,
      amount: data.data.payment.amount,
      currency: "INR",
      name: "Org. Name",
      description: "Test teansaction",
      image: "", // add image url
      order_id: data.data.payment.id,
      handler: function (response) {
        // we will handle success by calling handlePaymentSuccess method and
        // will pass the response that we've got from razorpay
        console.log(response);
        
        handlePaymentSuccess(response);
      },
      prefill: {
        name: "User's name",
        email: "User's email",
        contact: "User's phone",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  useEffect(() => loadScript(), []);

  const createOrder = async (body) => {
    body.set("total_price", total);
    const response = await fetch(`${baseUrl}/orders/`, {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });

    const data = response.json();
    console.log(data);
  };

  useEffect(() => {
    const userId = user?.user?.id;

    if (userId) loadCart(userId);
  }, [user]);

  const removeFromCart = async (product_id) => {
    const body = JSON.stringify({ product_id });
    console.log(body);

    const response = await fetch(`${baseUrl}/carts/remove-from-cart/`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    await response.json();
    if (response.ok) {
      if (user?.user?.id) {
        await loadCart(user?.user?.id);
      }
    } else {
      alert("Something went wrong");
    }
  };

  // const saveCart = async (product) => {
  //     await fetch("http://127.0.0.1:8000/api/carts/")
  // }

  const addToCart = async (productData) => {
    console.log(user);

    // const newProducts = [...cart?.products, productData]

    const body = JSON.stringify({ products: [productData] });
    const response = await fetch(`${baseUrl}/carts/add-to-cart/`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });
    const data = await response.json();
    console.log(data, response.ok);

    if (!response.ok) {
      alert("Some error occured");
    } else {
      if (user?.user?.id) await loadCart(user?.user?.id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        addToCart,
        total,
        removeFromCart,
        createOrder,
        showRazorpay
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
