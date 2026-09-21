import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Admin login required");
        setLoading(false);
        return;
      }

      try {
        const [productsResponse, usersResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/admin/products", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:5000/api/admin/users", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const productsData =
          await productsResponse.json();

        const usersData =
          await usersResponse.json();

        if (!productsResponse.ok) {
          setMessage(
            productsData.message ||
              "Unable to load products"
          );
          return;
        }

        if (!usersResponse.ok) {
          setMessage(
            usersData.message ||
              "Unable to load users"
          );
          return;
        }

        setProducts(productsData.products || []);
        setUsers(usersData.users || []);
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setMessage(
          "Unable to connect to server"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalProducts = products.length;

  const pendingProducts = products.filter(
    (product) =>
      product.status === "pending"
  ).length;

  const approvedProducts = products.filter(
    (product) =>
      product.status === "approved"
  ).length;

  const rejectedProducts = products.filter(
    (product) =>
      product.status === "rejected"
  ).length;

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) =>
      user.role === "admin"
  ).length;

  const normalUsers = users.filter(
    (user) =>
      user.role === "user"
  ).length;

  return (
    <main className="admin-dashboard">

      {/* BACKGROUND */}
      <div className="admin-bg admin-bg-one"></div>
      <div className="admin-bg admin-bg-two"></div>


      {/* HEADER */}
      <section className="admin-header">

        <div className="admin-header-icon">
          ⚙️
        </div>

        <div>
          <p className="admin-label">
            ADMIN CONTROL CENTER
          </p>

          <h1>
            Admin <span>Dashboard</span>
          </h1>

          <p className="admin-description">
            Manage users, books and marketplace
            activity from one place.
          </p>
        </div>

      </section>


      {/* MESSAGE */}
      {message && (
        <div className="admin-message">
          <span>⚠️</span>
          {message}
        </div>
      )}


      {/* LOADING */}
      {loading ? (
        <section className="admin-loading">

          <div className="admin-loader">
            ⚙️
          </div>

          <h2>
            Loading Admin Dashboard...
          </h2>

          <p>
            Fetching marketplace information
          </p>

        </section>
      ) : (
        <>


          {/* USER STATISTICS */}
          <section className="admin-section">

            <div className="section-heading">
              <div>
                <span>
                  USER MANAGEMENT
                </span>

                <h2>
                  👥 User Statistics
                </h2>
              </div>

              <div className="section-badge">
                LIVE DATA
              </div>
            </div>


            <div className="admin-grid">

              <div className="admin-card blue-card">
                <div className="card-icon">
                  👥
                </div>

                <div className="card-info">
                  <p>Total Users</p>
                  <h3>{totalUsers}</h3>
                </div>

                <div className="card-decoration">
                  👤
                </div>
              </div>


              <div className="admin-card teal-card">
                <div className="card-icon">
                  👤
                </div>

                <div className="card-info">
                  <p>Normal Users</p>
                  <h3>{normalUsers}</h3>
                </div>

                <div className="card-decoration">
                  📚
                </div>
              </div>


              <div className="admin-card orange-card">
                <div className="card-icon">
                  🛡️
                </div>

                <div className="card-info">
                  <p>Admin Users</p>
                  <h3>{adminUsers}</h3>
                </div>

                <div className="card-decoration">
                  ⚙️
                </div>
              </div>

            </div>

          </section>


          {/* PRODUCT STATISTICS */}
          <section className="admin-section">

            <div className="section-heading">
              <div>
                <span>
                  BOOK MANAGEMENT
                </span>

                <h2>
                  📚 Product Statistics
                </h2>
              </div>

              <div className="section-badge">
                MARKETPLACE
              </div>
            </div>


            <div className="admin-grid">

              <div className="admin-card purple-card">
                <div className="card-icon">
                  📚
                </div>

                <div className="card-info">
                  <p>Total Products</p>
                  <h3>{totalProducts}</h3>
                </div>

                <div className="card-decoration">
                  📖
                </div>
              </div>


              <div className="admin-card yellow-card">
                <div className="card-icon">
                  ⏳
                </div>

                <div className="card-info">
                  <p>Pending Products</p>
                  <h3>{pendingProducts}</h3>
                </div>

                <div className="card-decoration">
                  ⏰
                </div>
              </div>


              <div className="admin-card green-card">
                <div className="card-icon">
                  ✅
                </div>

                <div className="card-info">
                  <p>Approved Products</p>
                  <h3>{approvedProducts}</h3>
                </div>

                <div className="card-decoration">
                  ✔️
                </div>
              </div>


              <div className="admin-card red-card">
                <div className="card-icon">
                  ❌
                </div>

                <div className="card-info">
                  <p>Rejected Products</p>
                  <h3>{rejectedProducts}</h3>
                </div>

                <div className="card-decoration">
                  🚫
                </div>
              </div>

            </div>

          </section>


          {/* QUICK OVERVIEW */}
          <section className="overview-section">

            <div className="section-heading">
              <div>
                <span>
                  MARKETPLACE SUMMARY
                </span>

                <h2>
                  📊 Quick Overview
                </h2>
              </div>
            </div>


            <div className="overview-grid">

              <div className="overview-item">
                <div className="overview-icon">
                  👥
                </div>

                <div>
                  <p>Registered Users</p>
                  <strong>
                    {totalUsers}
                  </strong>
                </div>
              </div>


              <div className="overview-item">
                <div className="overview-icon">
                  📚
                </div>

                <div>
                  <p>Book Listings</p>
                  <strong>
                    {totalProducts}
                  </strong>
                </div>
              </div>


              <div className="overview-item">
                <div className="overview-icon">
                  ⏳
                </div>

                <div>
                  <p>Waiting Approval</p>
                  <strong>
                    {pendingProducts}
                  </strong>
                </div>
              </div>


              <div className="overview-item">
                <div className="overview-icon">
                  ✅
                </div>

                <div>
                  <p>Approved Listings</p>
                  <strong>
                    {approvedProducts}
                  </strong>
                </div>
              </div>


              <div className="overview-item">
                <div className="overview-icon">
                  ❌
                </div>

                <div>
                  <p>Rejected Listings</p>
                  <strong>
                    {rejectedProducts}
                  </strong>
                </div>
              </div>

            </div>

          </section>


          {/* FOOTER */}
          <section className="admin-footer">

            <div className="footer-book">
              📚
            </div>

            <div>
              <h2>
                USED BOOK MARKET
              </h2>

              <p>
                Admin control panel
              </p>
            </div>

            <div className="footer-status">
              <span></span>
              System Online
            </div>

          </section>

        </>
      )}

    </main>
  );
}

export default AdminDashboard;