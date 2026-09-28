import { useEffect, useState } from "react";
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
      setMessage("Admin login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

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
        setMessage(
          data.message ||
            "Unable to load payouts"
        );
        return;
      }

      setPayouts(data.payouts || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Admin payouts error:",
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
    fetchPayouts();
  }, []);

  const filteredPayouts =
    payouts.filter((payout) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(payout.id)
          .includes(searchText) ||
        String(payout.order_id)
          .includes(searchText) ||
        (payout.seller_name || "")
          .toLowerCase()
          .includes(searchText) ||
        (payout.seller_email || "")
          .toLowerCase()
          .includes(searchText) ||
        (payout.transaction_id || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        payout.payout_status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <main className="payouts-page">

      {/* Background decoration */}
      <div className="payouts-glow payouts-glow-one"></div>
      <div className="payouts-glow payouts-glow-two"></div>

      <div className="payouts-floating-icon payouts-floating-one">
        💰
      </div>

      <div className="payouts-floating-icon payouts-floating-two">
        ₹
      </div>


      {/* Header */}
      <section className="payouts-header">

        <div className="payouts-icon">
          💰
        </div>

        <p className="payouts-label">
          ADMIN CONTROL CENTER
        </p>

        <h1>
          Seller <span>Payouts</span>
        </h1>

        <p className="payouts-subtitle">
          Manage payments that are due to
          sellers after completed orders.
        </p>

      </section>


      {/* Search / Filter Panel */}
      <section className="payouts-controls">

        <div className="payouts-controls-heading">

          <div className="payouts-controls-icon">
            💰
          </div>

          <div>
            <p className="payouts-controls-label">
              PAYOUT DATABASE
            </p>

            <h2>
              All Payouts
            </h2>
          </div>

        </div>


        <div className="payouts-filters">

          <div className="payout-search">

            <span className="payout-search-icon">
              🔎
            </span>

            <input
              type="text"
              placeholder="Search payout, seller or transaction..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <button
            type="button"
            className="payout-clear-button"
            onClick={() =>
              setSearch("")
            }
          >
            Clear Search
          </button>


          <label className="payout-status-filter">

            <span>
              Status
            </span>

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

              <option value="pending">
                Pending
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="failed">
                Failed
              </option>
            </select>

          </label>

        </div>

      </section>


      {/* Message */}
      {message && (
        <div className="payout-message">
          ⚠️
          <span>{message}</span>
        </div>
      )}


      {/* Results information */}
      <div className="payout-results">

        <span>
          Showing
        </span>

        <strong>
          {filteredPayouts.length}
        </strong>

        <span>
          of
        </span>

        <strong>
          {payouts.length}
        </strong>

        <span>
          payouts
        </span>

      </div>


      {/* Loading */}
      {loading ? (
        <div className="payout-state">
          <span className="payout-state-icon">
            ⏳
          </span>

          <p>
            Loading payouts...
          </p>
        </div>
      ) : filteredPayouts.length === 0 ? (

        <div className="payout-state">

          <span className="payout-state-icon">
            💸
          </span>

          <p>
            No payouts found.
          </p>

        </div>

      ) : (

        /* Payout Table */
        <section className="payouts-table-section">

          <div className="payouts-table-top">

            <div>
              <p>
                TRANSACTION RECORDS
              </p>

              <h2>
                Payout History
              </h2>
            </div>

            <span className="payout-count">
              {filteredPayouts.length} Records
            </span>

          </div>


          <div className="payouts-table-wrapper">

            <table className="payouts-table">

              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Order ID</th>
                  <th>Seller</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                  <th>Paid At</th>
                  <th>Created At</th>
                </tr>
              </thead>


              <tbody>

                {filteredPayouts.map(
                  (payout) => (

                    <tr key={payout.id}>

                      <td className="payout-id">
                        #{payout.id}
                      </td>


                      <td className="order-id">
                        #{payout.order_id}
                      </td>


                      <td className="seller-cell">

                        <strong>
                          {payout.seller_name ||
                            "Unknown"}
                        </strong>

                        <span>
                          {payout.seller_email ||
                            ""}
                        </span>

                      </td>


                      <td className="payout-amount">
                        ₹{payout.amount}
                      </td>


                      <td>

                        <span
                          className={`payout-status payout-status-${payout.payout_status}`}
                        >
                          {payout.payout_status}
                        </span>

                      </td>


                      <td className="transaction-cell">
                        {payout.transaction_id ||
                          "Not available"}
                      </td>


                      <td className="date-cell">
                        {payout.paid_at
                          ? new Date(
                              payout.paid_at
                            ).toLocaleString()
                          : "Not paid"}
                      </td>


                      <td className="date-cell">
                        {new Date(
                          payout.created_at
                        ).toLocaleString()}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

      )}

    </main>
  );
}

export default AdminPayouts;