import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Books", path: "/books" },
    { name: "Sell", path: "/sell" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Orders", path: "/orders" },
    { name: "Listings", path: "/listings" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Profile", path: "/profile" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  return (
    <nav className="navbar">

      {/* Logo */}
      <NavLink to="/" className="navbar-logo">
        USED BOOK MARKET
      </NavLink>

      {/* Navigation */}
      <div className="nav-links">

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {item.name}
          </NavLink>
        ))}

      </div>

    </nav>
  );
}

export default Navbar;