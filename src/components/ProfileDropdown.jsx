import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileDropdown.css";
import logo from "../assets/logo.png";

export function ProfileDropdown({ username }) {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className="profile-dropdown">

      <button onClick={toggleDropdown} className="profile-button">
        <img 
          src={logo}
          alt="User Logo"
          className="profile-avatar"
        />
        <span>{username || "Guest"}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">

          <div 
            className="dropdown-item"
            onClick={() => handleNavigation("/customerhome")}
          >
            Profile
          </div>

          <div 
            className="dropdown-item"
            onClick={() => handleNavigation("/orders")}
          >
            Orders
          </div>

          <div 
            className="dropdown-item logout"
            onClick={handleLogout}
          >
            Logout
          </div>

        </div>
      )}

    </div>
  );
}