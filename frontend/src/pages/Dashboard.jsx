import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const dashboardItems = [
    {
      icon: "👤",
      title: "My Profile",
      text: "View and manage your profile.",
      path: "/profile",
      className: "profile-card",
    },
    {
      icon: "📦",
      title: "My Orders",
      text: "View your purchased books and order status.",
      path: "/orders",
      className: "orders-card",
    },
    {
      icon: "📚",
      title: "My Listings",
      text: "Manage books you are selling.",
      path: "/listings",
      className: "listings-card",
    },
    {
      icon: "❤️",
      title: "My Wishlist",
      text: "View books you want to buy later.",
      path: "/wishlist",
      className: "wishlist-card",
    },
    {
      icon: "💰",
      title: "Sell a Book",
      text: "List your used book for other students.",
      path: "/sell",
      className: "sell-card",
    },
    {
      icon: "🔍",
      title: "Browse Books",
      text: "Find books available for purchase.",
      path: "/books",
      className: "browse-card",
    },
  ];

  return (
    <main className="dashboard-page">
      {/* Background decoration */}
      <div className="dashboard-bg-circle circle-one"></div>
      <div className="dashboard-bg-circle circle-two"></div>

      {/* Header */}
      <section className="dashboard-header">
        <div className="dashboard-icon">📚</div>

        <p className="dashboard-label">
          STUDENT MARKETPLACE
        </p>

        <h1>
          My <span>Dashboard</span>
        </h1>

        <p className="dashboard-subtitle">
          Welcome to your USED BOOK MARKET dashboard.
          <br />
          Manage your books, orders, wishlist and profile from one place.
        </p>
      </section>

      {/* Dashboard Cards */}
      <section className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <Link
            to={item.path}
            className={`dashboard-card ${item.className}`}
            key={item.title}
            style={{ "--card-delay": `${index * 0.1}s` }}
          >
            <div className="card-top">
              <div className="dashboard-card-icon">
                {item.icon}
              </div>

              <span className="card-arrow">↗</span>
            </div>

            <div className="card-content">
              <h2>{item.title}</h2>

              <p>{item.text}</p>
            </div>

            <div className="card-line"></div>

            <span className="card-action">
              Open →
            </span>
          </Link>
        ))}
      </section>

      {/* Bottom Information */}
      <section className="dashboard-footer">
        <div className="footer-book-animation">
          📖
        </div>

        <div>
          <h2>Give Your Books a Second Life</h2>
          <p>
            Buy affordable books, sell your old books,
            and help other students find useful study materials.
          </p>
        </div>

        <Link to="/books" className="dashboard-browse-button">
          Explore Books →
        </Link>
      </section>
    </main>
  );
}

export default Dashboard;