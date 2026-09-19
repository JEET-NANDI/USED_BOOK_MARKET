import { useEffect, useState } from "react";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Admin login required");
        return;
      }

      try {
        const [productsResponse, usersResponse] =
          await Promise.all([
            fetch(
              "http://localhost:5000/api/admin/products",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            fetch(
              "http://localhost:5000/api/admin/users",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
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
    <div>
      <h1>Admin Dashboard</h1>

      <p>
        Manage USED BOOK MARKET from one place.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <hr />

      <h2>User Statistics</h2>

      <div>
        <div>
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>

        <div>
          <h3>Normal Users</h3>
          <p>{normalUsers}</p>
        </div>

        <div>
          <h3>Admin Users</h3>
          <p>{adminUsers}</p>
        </div>
      </div>

      <hr />

      <h2>Product Statistics</h2>

      <div>
        <div>
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div>
          <h3>Pending Products</h3>
          <p>{pendingProducts}</p>
        </div>

        <div>
          <h3>Approved Products</h3>
          <p>{approvedProducts}</p>
        </div>

        <div>
          <h3>Rejected Products</h3>
          <p>{rejectedProducts}</p>
        </div>
      </div>

      <hr />

      <h2>Quick Overview</h2>

      <p>
        Total registered users:{" "}
        <strong>{totalUsers}</strong>
      </p>

      <p>
        Total book listings:{" "}
        <strong>{totalProducts}</strong>
      </p>

      <p>
        Listings waiting for approval:{" "}
        <strong>{pendingProducts}</strong>
      </p>

      <p>
        Approved listings:{" "}
        <strong>{approvedProducts}</strong>
      </p>

      <p>
        Rejected listings:{" "}
        <strong>{rejectedProducts}</strong>
      </p>
    </div>
  );
}

export default AdminDashboard;