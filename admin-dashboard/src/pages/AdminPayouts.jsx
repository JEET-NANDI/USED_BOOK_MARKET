import { useEffect, useMemo, useState } from "react";
import "./AdminPayouts.css";

function AdminPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required. Please sign in to continue.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/admin/payouts",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load payouts.");
        return;
      }

      setPayouts(data.payouts || []);
    } catch (error) {
      console.error("Admin payouts error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const filteredPayouts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return payouts.filter((payout) => {
      const matchesSearch =
        !searchText ||
        String(payout.id ?? "").toLowerCase().includes(searchText) ||
        String(payout.order_id ?? "").toLowerCase().includes(searchText) ||
        (payout.seller_name || "").toLowerCase().includes(searchText) ||
        (payout.seller_email || "").toLowerCase().includes(searchText) ||
        (payout.transaction_id || "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        (payout.payout_status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payouts, search, statusFilter]);

  const totalAmount = payouts.reduce(
    (total, payout) => total + (Number(payout.amount) || 0),
    0
  );

  const pendingCount = payouts.filter(
    (payout) => payout.payout_status?.toLowerCase() === "pending"
  ).length;

  const paidCount = payouts.filter(
    (payout) => payout.payout_status?.toLowerCase() === "paid"
  ).length;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "—";

  const formatAmount = (amount) =>
    `₹${(Number(amount) || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <main className="payouts-page">
      <div className="payouts-shell">
        <header className="payouts-header">
          <div>
            <p className="payouts-eyebrow">Finance dashboard</p>
            <h1 className="payouts-title">Seller Payouts</h1>
            <p className="payouts-description">
              Track and manage payments due to sellers after completed orders.
            </p>
          </div>

          <button
            className="refresh-button"
            type="button"
            onClick={fetchPayouts}
            disabled={loading}
            aria-label="Refresh payouts"
          >
            <span className="refresh-icon" aria-hidden="true">
              ↻
            </span>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        <section className="summary-grid" aria-label="Payout summary">
          <article className="summary-card total">
            <p className="summary-label">Total payout value</p>
            <p className="summary-value">{formatAmount(totalAmount)}</p>
            <p className="summary-note">Across all listed payouts</p>
          </article>

          <article className="summary-card pending">
            <p className="summary-label">Pending payouts</p>
            <p className="summary-value">{pendingCount}</p>
            <p className="summary-note">Awaiting payment</p>
          </article>

          <article className="summary-card paid">
            <p className="summary-label">Completed payouts</p>
            <p className="summary-value">{paidCount}</p>
            <p className="summary-note">Successfully paid to sellers</p>
          </article>
        </section>

        <section className="payouts-panel">
          <div className="toolbar">
            <div>
              <h2 className="toolbar-title">Payout history</h2>
              <p className="toolbar-count">
                Showing <strong>{filteredPayouts.length}</strong> of{" "}
                <strong>{payouts.length}</strong> payouts
              </p>
            </div>

            <div className="toolbar-controls">
              <div className="search-wrap">
                <span className="search-icon" aria-hidden="true">
                  ⌕
                </span>
                <input
                  className="search-input"
                  type="search"
                  placeholder="Search seller, payout, order..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search payouts"
                />
              </div>

              {search && (
                <button
                  className="clear-button"
                  type="button"
                  onClick={() => setSearch("")}
                >
                  Clear
                </button>
              )}

              <select
                className="status-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter payouts by status"
              >
                <option value="All">All statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {message && (
            <div className="notice" role="alert">
              {message}
            </div>
          )}

          {loading ? (
            <div className="loading-state" role="status">
              <div className="loading-spinner" />
              Loading payouts...
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                🔎
              </div>
              <strong>No payouts found</strong>
              <p>Try changing your search or selecting a different status.</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="payouts-table">
                <thead>
                  <tr>
                    <th>Payout ID</th>
                    <th>Order ID</th>
                    <th>Seller</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Transaction ID</th>
                    <th>Paid at</th>
                    <th>Created at</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayouts.map((payout) => {
                    const status = (
                      payout.payout_status || "unknown"
                    ).toLowerCase();

                    const supportedStatuses = [
                      "pending",
                      "processing",
                      "paid",
                      "failed",
                    ];

                    const statusClass = supportedStatuses.includes(status)
                      ? `status-${status}`
                      : "status-default";

                    return (
                      <tr key={payout.id}>
                        <td className="payout-id">#{payout.id}</td>
                        <td>#{payout.order_id}</td>

                        <td>
                          <span className="seller-name">
                            {payout.seller_name || "Unknown"}
                          </span>
                          {payout.seller_email && (
                            <span className="seller-email">
                              {payout.seller_email}
                            </span>
                          )}
                        </td>

                        <td className="amount-cell">
                          {formatAmount(payout.amount)}
                        </td>

                        <td>
                          <span className={`status-badge ${statusClass}`}>
                            <span className="status-dot" aria-hidden="true" />
                            {status}
                          </span>
                        </td>

                        <td
                          className="transaction-cell"
                          title={payout.transaction_id || "Not available"}
                        >
                          {payout.transaction_id || "Not available"}
                        </td>

                        <td>{formatDate(payout.paid_at)}</td>
                        <td>{formatDate(payout.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminPayouts;