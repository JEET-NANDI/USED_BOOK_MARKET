import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isLoggedIn = !!token && !!user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <NavLink to="/" className="navbar-logo">
        USED BOOK MARKET
      </NavLink>

      <div className="nav-links">

        {/* NEW / LOGGED-OUT USER */}
        {!isLoggedIn && (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              About
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Register
            </NavLink>
          </>
        )}

        {/* LOGGED-IN USER */}
        {isLoggedIn && user?.role !== "admin" && (
          <>
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>

            <NavLink to="/books" className="nav-link">
              Books
            </NavLink>

            <NavLink to="/sell" className="nav-link">
              Sell
            </NavLink>

            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>

            <NavLink to="/orders" className="nav-link">
              Orders
            </NavLink>

            <NavLink to="/listings" className="nav-link">
              Listings
            </NavLink>

            <NavLink to="/wishlist" className="nav-link">
              Wishlist
            </NavLink>

            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>

            <button
              type="button"
              className="nav-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;