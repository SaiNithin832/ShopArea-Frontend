import React from 'react';
import '../styles/CustomerHomePage.css';

export function ProductList({ products = [], onAddToCart }) {

  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {

        const imageUrl =
          product.images && product.images.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/150";

        return (
          <div key={product.product_id} className="product-card">

            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
            />

            <h3>{product.name}</h3>

            <p>${Number(product.price).toFixed(2)}</p>

            <button
              onClick={() => onAddToCart(product.product_id)}
              disabled={!product.stock || product.stock === 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

          </div>
        );
      })}
    </div>
  );
}