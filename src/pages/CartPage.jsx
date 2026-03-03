import React, { useEffect, useState } from "react";
import "../styles/CartPage.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

export default function CartPage() {

  const [cartItems, setCartItems] = useState([]);
  const [overallPrice, setOverallPrice] = useState(0);
  const [username, setUsername] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH CART =================
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const storedUser = localStorage.getItem("username");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:9092/api/cart/items?username=${storedUser}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();

      const items =
        data?.cart?.products?.map(item => ({
          ...item,
          price_per_unit: Number(item.price_per_unit),
          total_price: Number(item.total_price)
        })) || [];

      setCartItems(items);
      setUsername(data?.username || storedUser);

    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // ================= CALCULATE TOTALS =================
  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce(
      (sum, item) =>
        sum + (item.price_per_unit * item.quantity),
      0
    );

    setSubtotal(calculatedSubtotal);

    const calculatedShipping = cartItems.length > 0 ? 370 : 0;
    setShipping(calculatedShipping);

    setOverallPrice(calculatedSubtotal + calculatedShipping);

  }, [cartItems]);

  // ================= CHECKOUT FUNCTION =================
  const handleCheckout = async () => {

    if (checkoutLoading) return;

    setCheckoutLoading(true);

    try {

      console.log("Checkout started");

      const response = await fetch(
        "http://localhost:9092/api/payment/create",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            totalAmount: overallPrice,
            cartItems: cartItems.map(item => ({
              productId: item.product_id,
              quantity: item.quantity,
              price: item.price_per_unit
            }))
          })
        }
      );

      if (!response.ok) {
        throw new Error("Payment creation failed");
      }

      const orderId = await response.text();

      // ===== RAZORPAY OPTIONS =====
      const options = {
        key: "rzp_test_LqWBBDbgwot5lh", // your test key
        amount: overallPrice * 100,
        currency: "INR",
        name: "GlobalMart",
        order_id: orderId,

        handler: async function (response) {

          try {

            const verifyResponse = await fetch(
              "http://localhost:9092/api/payment/verify",
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                })
              }
            );

            if (verifyResponse.ok) {
              alert("Payment Successful ✅");
              setCartItems([]);
              navigate("/orders");
            } else {
              alert("Payment verification failed ❌");
            }

          } catch (error) {
            console.error("Verification error:", error);
            alert("Verification error ❌");
          }
        }
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Add script in index.html");
        return;
      }

      new window.Razorpay(options).open();

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed ❌");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ================= UI =================
  return (
    <>
      <Header username={username} cartCount={cartItems.length} />

      <div className="cart-container">

        <div className="cart-title">
          <FaShoppingCart className="cart-main-icon" />
          <h2>My Cart</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <h3>Your cart is empty</h3>
          </div>
        ) : (
          <div className="cart-content">

            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.product_id} className="cart-item">

                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="cart-image"
                  />

                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="price">
                      ₹{item.price_per_unit.toFixed(2)}
                    </p>
                  </div>

                  <div className="item-total">
                    ₹{(item.price_per_unit * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">

              <h3>Order Summary</h3>

              <p>
                Subtotal:
                <span> ₹{subtotal.toFixed(2)}</span>
              </p>

              <p>
                Shipping:
                <span> ₹{shipping.toFixed(2)}</span>
              </p>

              <hr />

              <h3>
                Total:
                <span> ₹{overallPrice.toFixed(2)}</span>
              </h3>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
              </button>

            </div>

          </div>
        )}

      </div>

      <Footer />
    </>
  );
}