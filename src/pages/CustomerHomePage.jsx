import React, { useState, useEffect } from 'react';
import { CategoryNavigation } from '../components/CategoryNavigation';
import { ProductList } from '../components/ProductList';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import "../styles/CustomerHomePage.css";

export default function CustomerHomePage() {

  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // ✅ Load products and cart count on page load
  useEffect(() => {
  fetchProducts();
  fetchCartCount();

  const handleVisibility = () => {
    if (document.visibilityState === "visible") {
      fetchProducts();
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}, []);

  // ✅ Fetch Products
  const fetchProducts = async (category = '') => {
    try {
      const response = await fetch(
        `http://localhost:9092/api/products${
          category ? `?category=${category}` : ''
        }`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Backend returns { user, products }
      setProducts(data.products || []);
      setUsername(data.user?.name || localStorage.getItem("username") || "Guest");

    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  // ✅ Fetch Cart Count
  const fetchCartCount = async () => {
    try {
      const storedUsername = localStorage.getItem("username");

      if (!storedUsername) return;

      const response = await fetch(
        `http://localhost:9092/api/cart/items/count?username=${storedUsername}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart count");
      }

      const count = await response.json();
      setCartCount(count);

    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  // ✅ Handle Category Click
  const handleCategoryClick = (category) => {
    fetchProducts(category);
  };

  // ✅ Add To Cart
  const handleAddToCart = async (productId) => {
    try {
      const storedUsername = localStorage.getItem("username");

      if (!storedUsername) {
        console.error("User not logged in");
        return;
      }

      const response = await fetch(
        "http://localhost:9092/api/cart/add",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: storedUsername,
            productId: productId,
            quantity: 1
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // Refresh cart count after adding
      fetchCartCount();

    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="customer-homepage">

      <Header
        cartCount={cartCount}
        username={username}
      />

      <nav className="navigation">
        <CategoryNavigation onCategoryClick={handleCategoryClick} />
      </nav>

      <main className="main-content">
        <ProductList
          products={products}
          onAddToCart={handleAddToCart}
        />
      </main>

      <Footer />
    </div>
  );
}