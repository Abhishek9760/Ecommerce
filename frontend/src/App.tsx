import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import Nav from "./components/Nav";
import { Products } from "./pages/Products";
import { useState } from "react";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrdersHistory } from "./pages/OrdersHistory";

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <Router>
      <div className="bg-white">
        <Nav setCartOpen={setCartOpen} />
        <Cart open={cartOpen} setOpen={setCartOpen} />
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/orders" element={<OrdersHistory />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
