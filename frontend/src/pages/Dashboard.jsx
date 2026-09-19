import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <h1>My Dashboard</h1>

      <p>
        Welcome to your USED BOOK MARKET dashboard.
      </p>

      <div className="dashboard-grid">
        <Link to="/profile">
          <h2>My Profile</h2>
          <p>View and manage your profile.</p>
        </Link>

        <Link to="/orders">
          <h2>My Orders</h2>
          <p>View your purchased books and order status.</p>
        </Link>

        <Link to="/listings">
          <h2>My Listings</h2>
          <p>Manage books you are selling.</p>
        </Link>

        <Link to="/wishlist">
          <h2>My Wishlist</h2>
          <p>View books you want to buy later.</p>
        </Link>

        <Link to="/sell">
          <h2>Sell a Book</h2>
          <p>List your used book for other students.</p>
        </Link>

        <Link to="/books">
          <h2>Browse Books</h2>
          <p>Find books available for purchase.</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;