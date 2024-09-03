import { createContext, useEffect, useState } from "react";
import { baseUrl } from "../constants";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { apiInstance } from "../utils/axios";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await localStorage.getItem("user");

      if (userData) {
        console.log("Setting state");
        setUser(JSON.parse(userData));
      }
    };

    loadUser();
  }, []);

  const deleteProduct = (id) =>
    apiInstance.delete(`/products/${id}/`).then((res) => res);

  const login = async (userCred) => {
    const body = JSON.stringify(userCred);
    const response = await fetch(`${baseUrl}/token/`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok){
        alert("Wrong email or password");
    }
    const data = await response.json();
    const userId = jwtDecode(data?.access)?.user_id;

   apiInstance
      .get(`/users/${userId}`)
      .then((res) => {
        console.log(res);
        
        const newState = { token: data?.access, user: res.data };
        localStorage.setItem("user", JSON.stringify(newState));
        setUser(newState);
        navigate("/");
      })
      .catch((err) => {
        alert("Wrong email or password");
      });
  };

  const register = async (userCred) => {
    const body = JSON.stringify(userCred);
    const response = await fetch(`${baseUrl}/users/`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });
    const data = response.json();
    console.log(data);
    if (response.ok) {
      alert("User registered successfully.");
      navigate("/register");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <UserContext.Provider value={{ user, login, register, deleteProduct }}>
      {children}
    </UserContext.Provider>
  );
};
