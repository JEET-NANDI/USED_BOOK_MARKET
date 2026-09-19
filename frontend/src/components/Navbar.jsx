import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        USED BOOK MARKET
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/books">Books</Link>

        <Link to="/sell">Sell</Link>

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/orders">Orders</Link>

        <Link to="/listings">Listings</Link>

        <Link to="/wishlist">Wishlist</Link>

        <Link to="/profile">Profile</Link>

        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;