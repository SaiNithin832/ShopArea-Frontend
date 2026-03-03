import React from "react";
import { FaShoppingBag } from "react-icons/fa";
import "../styles/Header.css";

export default function Logo() {
  return (
    <div className="logo">
      <FaShoppingBag className="brand-icon" />
      <span className="brand-name">ShopArea</span>
    </div>
  );
}