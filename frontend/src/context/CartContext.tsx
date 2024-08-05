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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
