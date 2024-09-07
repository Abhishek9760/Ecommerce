import {  Routes, Route, HashRouter } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { AddProduct } from "./pages/AddProduct.jsx";
import { Home } from "./pages/Home.jsx";
import Nav from "./components/Nav.jsx";
import { Products } from "./pages/Products.jsx";
import { useState } from "react";
import { Cart } from "./pages/Cart.jsx";
import { Checkout } from "./pages/Checkout.jsx";
import { OrdersHistory } from "./pages/OrdersHistory.jsx";
import { Register } from "./pages/Register.jsx";
import { CartContextProvider } from "./context/CartContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import ManageProduct from "./pages/ManageProduct.jsx";
import { Tracking } from "./pages/Tracking.jsx";
import { ModalContextProvider } from "./context/ModelContext.jsx";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <HashRouter>
      <ModalContextProvider>
        <UserContextProvider>
          <CartContextProvider>
            <div className="bg-white">
              <Nav setCartOpen={setCartOpen} />
              <Cart open={cartOpen} setOpen={setCartOpen} />
              <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/" element={<Home />}></Route>
                <Route path="/products" element={<Products />}></Route>
                <Route path="/checkout" element={<Checkout />}></Route>
                <Route path="/add-product" element={<AddProduct />}></Route>
                <Route path="/orders" element={<OrdersHistory />}></Route>
                <Route path="/manage" element={<ManageProduct />}></Route>
                <Route path="/track" element={<Tracking />}></Route>
              </Routes>
            </div>
          </CartContextProvider>
        </UserContextProvider>
      </ModalContextProvider>
    </HashRouter>
  );
}

export default App;
