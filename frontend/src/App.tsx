import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Login } from "./pages/Login";
import { AddProduct } from "./pages/AddProduct";
import { Home } from "./pages/Home";
import Nav from "./components/Nav";
import { Products } from "./pages/Products";
import { useState } from "react";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrdersHistory } from "./pages/OrdersHistory";
import { Register } from "./pages/Register";
import { CartContextProvider } from "./context/CartContext.tsx";
import { UserContextProvider } from "./context/UserContext.tsx";
import ManageProduct from "./pages/ManageProduct.tsx";

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <Router>
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
            </Routes>
          </div>
        </CartContextProvider>
      </UserContextProvider>
    </Router>
  );
}

export default App;
