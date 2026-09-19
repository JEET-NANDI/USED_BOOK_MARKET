import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav>
      <h2>USED BOOK MARKET - Admin Panel</h2>

      <div>
        <Link to="/">Dashboard</Link>
        {" | "}

        <Link to="/products">
          All Products
        </Link>
        {" | "}

        <Link to="/products/pending">
          Pending Products
        </Link>
        {" | "}

        <Link to="/users">
          Users
        </Link>
        {" | "}

        <Link to="/orders">
          Orders
        </Link>
        {" | "}

        <Link to="/payments">
          Payments
        </Link>
        {" | "}

        <Link to="/shipping">
          Shipping
        </Link>
        {" | "}

        <Link to="/payouts">
          Payouts
        </Link>
        {" | "}

        <Link to="/categories">
          Categories
        </Link>
        {" | "}

        <Link to="/reports">
          Reports
        </Link>
        {" | "}

        <Link to="/pricing">
          Pricing
        </Link>
        {" | "}

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;