import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to view your orders.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders/my",
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
            "Unable to load orders."
        );
        return;
      }

      setOrders(data.orders || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Orders error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      statusFilter === "All" ||
      order.status ===
        statusFilter.toLowerCase()
  );

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      <p>
        View and track the books you
        have purchased.
      </p>

      {message && (
        <p>{message}</p>
      )}

      {!localStorage.getItem("token") ? (
        <div>
          <p>
            Please login to see your
            orders.
          </p>

          <Link to="/login">
            <button type="button">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="orders-filter">
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

          {loading ? (
            <p>
              Loading orders...
            </p>
          ) : filteredOrders.length === 0 ? (
            <div>
              <p>
                No orders found.
              </p>

              <Link to="/books">
                <button type="button">
                  Browse Books
                </button>
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(
                (order) => (
                  <div
                    className="order-card"
                    key={order.id}
                  >
                    <h2>
                      Order #
                      {order.id}
                    </h2>

                    <p>
                      <strong>
                        Book:
                      </strong>{" "}
                      {order.product_title ||
                        "Book"}
                    </p>

                    <p>
                      <strong>
                        Seller:
                      </strong>{" "}
                      {order.seller_name ||
                        "Student Seller"}
                    </p>

                    <p>
                      <strong>
                        Seller Price:
                      </strong>{" "}
                      ₹
                      {order.seller_price}
                    </p>

                    <p>
                      <strong>
                        Platform Fee:
                      </strong>{" "}
                      ₹
                      {order.platform_fee}
                    </p>

                    <p>
                      <strong>
                        Buyer Price:
                      </strong>{" "}
                      ₹
                      {order.buyer_price}
                    </p>

                    <p>
                      <strong>
                        Status:
                      </strong>{" "}
                      {order.status}
                    </p>

                    <p>
                      <strong>
                        Delivery Address:
                      </strong>{" "}
                      {order.delivery_address ||
                        "Not available"}
                    </p>

                    <p>
                      <strong>
                        Ordered On:
                      </strong>{" "}
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>

                    <div>
                      {order.product_id && (
                        <Link
                          to={`/books/${order.product_id}`}
                        >
                          <button type="button">
                            View Book
                          </button>
                        </Link>
                      )}

                      {" "}

                      {order.status ===
                        "delivered" && (
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              "Review feature will be available soon."
                            )
                          }
                        >
                          Review Book
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;