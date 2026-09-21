import { useEffect, useState } from "react";
import "./AdminPayments.css";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/payments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load payments");
        return;
      }

      setPayments(data.payments || []);
      setMessage("");
    } catch (error) {
      console.error("Admin payments error:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(payment.id).includes(searchText) ||
      String(payment.order_id).includes(searchText) ||
      (payment.buyer_name || "")
        .toLowerCase()
        .includes(searchText) ||
      (payment.buyer_email || "")
        .toLowerCase()
        .includes(searchText) ||
      (payment.transaction_id || "")
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      payment.payment_status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "payment-status pending";

      case "paid":
        return "payment-status paid";

      case "failed":
        return "payment-status failed";

      case "refunded":
        return "payment-status refunded";

      default:
        return "payment-status default";
    }
  };

  const totalAmount = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const paidPayments = payments.filter(
    (payment) => payment.payment_status === "paid"
  );

  const pendingPayments = payments.filter(
    (payment) => payment.payment_status === "pending"
  );

  return (
    <main className="admin-payments-page">

      {/* Animated background */}
      <div className="payments-bg bg-one"></div>
      <div className="payments-bg bg-two"></div>
      <div className="payments-bg bg-three"></div>

      {/* Floating icons */}
      <div className="payments-floating-icon icon-one">
        💳
      </div>

      <div className="payments-floating-icon icon-two">
        💰
      </div>

      <div className="payments-floating-icon icon-three">
        🪙
      </div>

      {/* Header */}
      <section className="admin-payments-header">
        <div className="payments-main-icon">
          💳
        </div>

        <p className="payments-label">
          ADMIN CONTROL CENTER
        </p>

        <h1>
          Payment <span>Management</span>
        </h1>

        <p className="payments-description">
          Monitor buyer payments, transactions,
          payment methods and payment status.
        </p>

        <div className="payments-header-line"></div>
      </section>

      {/* Message */}
      {message && (
        <div className="admin-payments-message">
          ⚠️ {message}
        </div>
      )}

      {/* Summary */}
      <section className="payments-summary">

        <div className="payment-summary-card">
          <div className="summary-card-icon">
            💳
          </div>

          <div>
            <small>TOTAL PAYMENTS</small>
            <strong>{payments.length}</strong>
          </div>
        </div>

        <div className="payment-summary-card">
          <div className="summary-card-icon teal">
            🔎
          </div>

          <div>
            <small>SHOWING</small>
            <strong>{filteredPayments.length}</strong>
          </div>
        </div>

        <div className="payment-summary-card">
          <div className="summary-card-icon green">
            ✓
          </div>

          <div>
            <small>PAID</small>
            <strong>{paidPayments.length}</strong>
          </div>
        </div>

        <div className="payment-summary-card">
          <div className="summary-card-icon orange">
            ⏳
          </div>

          <div>
            <small>PENDING</small>
            <strong>{pendingPayments.length}</strong>
          </div>
        </div>

        <div className="payment-summary-card amount-card">
          <div className="summary-card-icon gold">
            ₹
          </div>

          <div>
            <small>TOTAL AMOUNT</small>
            <strong>₹{totalAmount.toFixed(2)}</strong>
          </div>
        </div>

      </section>

      {/* Toolbar */}
      <section className="admin-payments-toolbar">

        <div className="payments-toolbar-title">
          <div className="toolbar-payment-icon">
            💰
          </div>

          <div>
            <small>PAYMENT DATABASE</small>
            <h2>All Payments</h2>
          </div>
        </div>

        <div className="payments-controls">

          <div className="payment-search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search payment, order, buyer or transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="payment-clear-button"
            onClick={() => setSearch("")}
          >
            Clear
          </button>

          <div className="payment-status-filter">

            <label htmlFor="payment-status">
              Status
            </label>

            <select
              id="payment-status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

          </div>

        </div>
      </section>

      {/* Content */}
      <section className="admin-payments-content">

        {loading ? (
          <div className="admin-payments-loading">

            <div className="payment-spinner"></div>

            <h2>Loading Payments...</h2>

            <p>
              Fetching payment information
              from the marketplace.
            </p>

          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="admin-payments-empty">

            <div className="empty-payment-icon">
              💳
            </div>

            <p>PAYMENT DATABASE</p>

            <h2>
              No payments found
            </h2>

            <span>
              Try changing your search or
              payment status filter.
            </span>

          </div>
        ) : (
          <div className="admin-payments-table-wrapper">

            <table className="admin-payments-table">

              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Transaction</th>
                  <th>Paid At</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>

                {filteredPayments.map(
                  (payment, index) => (
                    <tr
                      key={payment.id}
                      style={{
                        animationDelay: `${index * 0.06}s`,
                      }}
                    >

                      {/* Payment ID */}
                      <td>
                        <div className="payment-id-cell">

                          <span className="payment-card-icon">
                            💳
                          </span>

                          <strong>
                            #{payment.id}
                          </strong>

                        </div>
                      </td>

                      {/* Order */}
                      <td>
                        <div className="order-payment-cell">

                          <span>📦</span>

                          <strong>
                            #{payment.order_id}
                          </strong>

                        </div>
                      </td>

                      {/* Buyer */}
                      <td>
                        <div className="payment-buyer-cell">

                          <div className="buyer-avatar">
                            👤
                          </div>

                          <div>
                            <strong>
                              {payment.buyer_name ||
                                "Unknown"}
                            </strong>

                            <small>
                              {payment.buyer_email ||
                                "-"}
                            </small>
                          </div>

                        </div>
                      </td>

                      {/* Amount */}
                      <td>
                        <span className="payment-amount">
                          ₹{Number(
                            payment.amount || 0
                          ).toFixed(2)}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td>
                        <span className="payment-method">
                          💳{" "}
                          {payment.payment_method ||
                            "Not provided"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={getStatusClass(
                            payment.payment_status
                          )}
                        >
                          <span className="status-dot"></span>

                          {payment.payment_status}
                        </span>
                      </td>

                      {/* Transaction */}
                      <td>
                        <div className="transaction-cell">

                          <span>🔐</span>

                          <small>
                            {payment.transaction_id ||
                              "Not available"}
                          </small>

                        </div>
                      </td>

                      {/* Paid At */}
                      <td>
                        <div className="date-cell">

                          <span>✓</span>

                          {payment.paid_at
                            ? new Date(
                                payment.paid_at
                              ).toLocaleString()
                            : "Not paid"}

                        </div>
                      </td>

                      {/* Created */}
                      <td>
                        <div className="date-cell">

                          <span>🕒</span>

                          {new Date(
                            payment.created_at
                          ).toLocaleString()}

                        </div>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* Footer */}
      <section className="admin-payments-footer">

        <div className="payments-footer-icon">
          💳
        </div>

        <div>
          <h2>
            Marketplace Payment Overview
          </h2>

          <p>
            Monitor payment activity and keep
            buyer transactions organized.
          </p>
        </div>

      </section>

    </main>
  );
}

export default AdminPayments;