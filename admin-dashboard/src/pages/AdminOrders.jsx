import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load orders"
        );
        return;
      }

      setOrders(data.orders || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Admin orders error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(order.id)
          .includes(searchText) ||
        (order.product_title || "")
          .toLowerCase()
          .includes(searchText) ||
        (order.buyer_name || "")
          .toLowerCase()
          .includes(searchText) ||
        (order.buyer_email || "")
          .toLowerCase()
          .includes(searchText) ||
        (order.seller_name || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        order.status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  return (
    <div>
      <h1>Orders</h1>

      <p>
        Manage all buyer orders and
        order statuses.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Search order, buyer, seller or book..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {" "}

        <button
          type="button"
          onClick={() =>
            setSearch("")
          }
        >
          Clear Search
        </button>

        {" "}

        <label>
          Status:{" "}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </label>
      </div>

      <br />

      <p>
        Showing{" "}
        <strong>
          {filteredOrders.length}
        </strong>{" "}
        of{" "}
        <strong>
          {orders.length}
        </strong>{" "}
        orders
      </p>

      {loading ? (
        <p>
          Loading orders...
        </p>
      ) : filteredOrders.length === 0 ? (
        <p>
          No orders found.
        </p>
      ) : (
        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Book</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Seller Price</th>
              <th>Platform Fee</th>
              <th>Buyer Price</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(
              (order) => (
                <tr key={order.id}>
                  <td>
                    #{order.id}
                  </td>

                  <td>
                    {order.product_title}
                  </td>

                  <td>
                    {order.buyer_name}
                    <br />
                    {order.buyer_email}
                  </td>

                  <td>
                    {order.seller_name}
                    <br />
                    {order.seller_email}
                  </td>

                  <td>
                    ₹{order.seller_price}
                  </td>

                  <td>
                    ₹{order.platform_fee}
                  </td>

                  <td>
                    ₹{order.buyer_price}
                  </td>

                  <td>
                    {order.status}
                  </td>

                  <td>
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;