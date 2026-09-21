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
        setMessage(data.message || "Unable to load orders.");
        return;
      }

      setOrders(data.orders || []);
      setMessage("");
    } catch (error) {
      console.error("Orders error:", error);
      setMessage("Unable to connect to server.");
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
      order.status === statusFilter.toLowerCase()
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  return (
    <main className="orders-page">
      <div className="orders-bg orders-bg-one"></div>
      <div className="orders-bg orders-bg-two"></div>

      <div className="orders-floating-book orders-book-one">
        📘
      </div>

      <div className="orders-floating-book orders-book-two">
        📚
      </div>

      <div className="orders-floating-book orders-book-three">
        📖
      </div>

      {/* HEADER */}
      <section className="orders-header">
        <div className="orders-header-icon">
          📦
        </div>

        <p className="orders-label">
          STUDENT MARKETPLACE
        </p>

        <h1>
          My <span>Orders</span>
        </h1>

        <p className="orders-subtitle">
          View and track the books you have purchased.
          <br />
          Your complete order history is available here.
        </p>

        <div className="orders-header-line"></div>
      </section>

      {/* LOGIN MESSAGE */}
      {message && !localStorage.getItem("token") ? (
        <section className="orders-login-card">
          <div className="login-card-icon">
            🔐
          </div>

          <h2>Login Required</h2>

          <p>
            Please login to view and manage your orders.
          </p>

          <Link to="/login">
            <button
              type="button"
              className="orders-primary-button"
            >
              Login →
            </button>
          </Link>
        </section>
      ) : (
        <>
          {/* FILTER */}
          <section className="orders-toolbar">
            <div className="orders-toolbar-left">
              <span className="toolbar-icon">
                🔎
              </span>

              <div>
                <small>ORDER HISTORY</small>
                <h2>Your Purchases</h2>
              </div>
            </div>

            <div className="orders-filter">
              <label htmlFor="status-filter">
                Filter by status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </section>

          {/* MESSAGE */}
          {message && (
            <div className="orders-message">
              ⚠️ {message}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <section className="orders-loading">
              <div className="orders-spinner"></div>

              <h2>Loading Your Orders...</h2>

              <p>
                Please wait while we fetch your order
                history.
              </p>
            </section>
          ) : filteredOrders.length === 0 ? (
            /* EMPTY */
            <section className="orders-empty">
              <div className="empty-book">
                📕
              </div>

              <p className="empty-label">
                NO ORDERS FOUND
              </p>

              <h2>
                Your Order List Is Empty
              </h2>

              <p>
                You have not purchased any books matching
                this filter yet.
              </p>

              <Link to="/books">
                <button
                  type="button"
                  className="orders-primary-button"
                >
                  📚 Browse Books
                  <span>→</span>
                </button>
              </Link>
            </section>
          ) : (
            /* ORDERS */
            <section className="orders-list">
              {filteredOrders.map((order, index) => (
                <article
                  className="order-card"
                  key={order.id}
                  style={{
                    animationDelay: `${index * 0.12}s`,
                  }}
                >
                  {/* CARD TOP */}
                  <div className="order-card-top">
                    <div className="order-number">
                      <span>ORDER</span>
                      <strong>
                        #{order.id}
                      </strong>
                    </div>

                    <div
                      className={`order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      <span className="status-dot"></span>

                      {order.status}
                    </div>
                  </div>

                  <div className="order-card-line"></div>

                  {/* BOOK */}
                  <div className="order-book-section">
                    <div className="order-book-icon">
                      📖
                    </div>

                    <div className="order-book-info">
                      <small>BOOK</small>

                      <h2>
                        {order.product_title ||
                          "Book"}
                      </h2>

                      <p>
                        Seller:{" "}
                        <strong>
                          {order.seller_name ||
                            "Student Seller"}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="order-price-grid">
                    <div className="price-item">
                      <span>Seller Price</span>

                      <strong>
                        ₹{order.seller_price}
                      </strong>
                    </div>

                    <div className="price-item">
                      <span>Platform Fee</span>

                      <strong className="fee-price">
                        ₹{order.platform_fee}
                      </strong>
                    </div>

                    <div className="price-item buyer-price">
                      <span>Buyer Price</span>

                      <strong>
                        ₹{order.buyer_price}
                      </strong>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="order-details">
                    <div className="detail-item">
                      <span>📍</span>

                      <div>
                        <small>
                          DELIVERY ADDRESS
                        </small>

                        <p>
                          {order.delivery_address ||
                            "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span>🕒</span>

                      <div>
                        <small>
                          ORDERED ON
                        </small>

                        <p>
                          {new Date(
                            order.created_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="order-actions">
                    {order.product_id && (
                      <Link
                        to={`/books/${order.product_id}`}
                      >
                        <button
                          type="button"
                          className="view-book-button"
                        >
                          📚 View Book
                          <span>↗</span>
                        </button>
                      </Link>
                    )}

                    {order.status === "delivered" && (
                      <button
                        type="button"
                        className="review-button"
                        onClick={() =>
                          alert(
                            "Review feature will be available soon."
                          )
                        }
                      >
                        ⭐ Review Book
                      </button>
                    )}
                  </div>

                  {/* DELIVERY PROGRESS */}
                  <div className="order-progress">
                    <div
                      className={
                        order.status === "pending" ||
                        order.status === "confirmed" ||
                        order.status === "shipped" ||
                        order.status === "delivered"
                          ? "progress-step active"
                          : "progress-step"
                      }
                    >
                      <span>1</span>
                      <small>Placed</small>
                    </div>

                    <div
                      className={
                        order.status === "confirmed" ||
                        order.status === "shipped" ||
                        order.status === "delivered"
                          ? "progress-line active"
                          : "progress-line"
                      }
                    ></div>

                    <div
                      className={
                        order.status === "shipped" ||
                        order.status === "delivered"
                          ? "progress-step active"
                          : "progress-step"
                      }
                    >
                      <span>2</span>
                      <small>Shipped</small>
                    </div>

                    <div
                      className={
                        order.status === "delivered"
                          ? "progress-line active"
                          : "progress-line"
                      }
                    ></div>

                    <div
                      className={
                        order.status === "delivered"
                          ? "progress-step active"
                          : "progress-step"
                      }
                    >
                      <span>3</span>
                      <small>Delivered</small>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* FOOTER */}
          <section className="orders-footer">
            <div className="footer-book-icon">
              📚
            </div>

            <div>
              <h2>
                Give Books a Second Life
              </h2>

              <p>
                Looking for your next study book?
                Explore more affordable books from
                student sellers.
              </p>
            </div>

            <Link to="/books">
              <button
                type="button"
                className="orders-footer-button"
              >
                Explore Books →
              </button>
            </Link>
          </section>
        </>
      )}
    </main>
  );
}

export default Orders;