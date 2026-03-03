// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import Logo from "../components/Logo";
import "../styles/AdminDashBoard.css";
import CustomModal from "./CustomModel";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      navigate("/login");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:9092/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ================= API HANDLERS ================= */

  const handleAddProductSubmit = async (productData) => {
    try {
      const res = await fetch("http://localhost:9092/admin/products/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Failed to add product");

      const data = await res.json();
      setResponse({ product: data });

    } catch (error) {
      console.error(error);
      setResponse({ message: error.message });
    }
  };

  const handleDeleteProductSubmit = async ({ productId }) => {
    try {
      const res = await fetch(
        "http://localhost:9092/admin/products/delete",
        {
          method: "DELETE",
          credentials: "include", // ⭐ Required for cookie auth
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Delete failed");
      }

      setResponse({ message: "Product Deleted Successfully" });

    } catch (error) {
      console.error("Delete error:", error);
      setResponse({ message: error.message });
    }
  };

  const handleViewUserSubmit = async ({ userId }) => {
    try {
      const res = await fetch("http://localhost:9092/admin/user/getbyid", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setResponse({ user: data });

    } catch (error) {
      console.error(error);
      setResponse({ message: error.message });
    }
  };

  const handleMonthlyBusiness = async (data) => {
    try {
      const res = await fetch(
        `http://localhost:9092/admin/business/monthly?month=${data.month}&year=${data.year}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to fetch monthly data");

      const result = await res.json();
      setResponse({ monthlyBusiness: result });

    } catch (error) {
      console.error(error);
      setResponse({ message: error.message });
    }
  };

  const handleDailyBusiness = async (data) => {
    try {
      const res = await fetch(
        `http://localhost:9092/admin/business/daily?date=${data.date}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to fetch daily data");

      const result = await res.json();
      setResponse({ dailyBusiness: result });

    } catch (error) {
      console.error(error);
      setResponse({ message: error.message });
    }
  };

  const handleYearlyBusiness = async (data) => {
    try {
      const res = await fetch(
        `http://localhost:9092/admin/business/yearly?year=${data.year}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to fetch yearly data");

      const result = await res.json();
      setResponse({ yearlyBusiness: result });

    } catch (error) {
      console.error(error);
      setResponse({ message: error.message });
    }
  };

  const handleOverallBusiness = async () => {
    try {
      const res = await fetch(
        `http://localhost:9092/admin/business/overall`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to fetch overall data");

      const result = await res.json();
      setResponse({ overallBusiness: result });

    } catch (error) {
      console.error(error);
      setResponse({ message: error.message });
    }
  };

  /* ================= CARD DATA ================= */

  const cardData = [
    { title: "Add Product", description: "Create new products.", team: "Product", modalType: "addProduct" },
    { title: "Delete Product", description: "Remove products.", team: "Product", modalType: "deleteProduct" },
    { title: "View User Details", description: "Review user info.", team: "User", modalType: "viewUser" },
    { title: "Monthly Business", description: "Monthly analytics.", team: "Analytics", modalType: "monthlyBusiness" },
    { title: "Day Business", description: "Daily analytics.", team: "Analytics", modalType: "dailyBusiness" },
    { title: "Yearly Business", description: "Year analytics.", team: "Analytics", modalType: "yearlyBusiness" },
    { title: "Overall Business", description: "Total revenue.", team: "Analytics", modalType: "overallBusiness" },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <Logo />
        <div className="user-info">
          <span className="username">Admin</span>
          <button className="dropdown-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="cards-grid">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => {
                setModalType(card.modalType);
                setResponse(null);
              }}
            >
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <span className="card-team">Team: {card.team}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {modalType && (
        <CustomModal
          modalType={modalType}
          response={response}
          onClose={() => {
            setModalType(null);
            setResponse(null);
          }}
          onSubmit={(data) => {
            switch (modalType) {
              case "addProduct":
                handleAddProductSubmit(data);
                break;
              case "deleteProduct":
                handleDeleteProductSubmit(data);
                break;
              case "viewUser":
                handleViewUserSubmit(data);
                break;
              case "monthlyBusiness":
                handleMonthlyBusiness(data);
                break;
              case "dailyBusiness":
                handleDailyBusiness(data);
                break;
              case "yearlyBusiness":
                handleYearlyBusiness(data);
                break;
              case "overallBusiness":
                handleOverallBusiness();
                break;
              default:
                break;
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;