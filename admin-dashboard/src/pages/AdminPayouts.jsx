import { useEffect, useState } from "react";

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
    <div>
      <h1>Seller Payouts</h1>

      <p>
        Manage payments that are due to
        sellers after completed orders.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Search payout, seller or transaction..."
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

      <br />

      <p>
        Showing{" "}
        <strong>
          {filteredPayouts.length}
        </strong>{" "}
        of{" "}
        <strong>
          {payouts.length}
        </strong>{" "}
        payouts
      </p>

      {loading ? (
        <p>
          Loading payouts...
        </p>
      ) : filteredPayouts.length === 0 ? (
        <p>
          No payouts found.
        </p>
      ) : (
        <table
          border="1"
          cellPadding="10"
        >
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
                  <td>
                    #{payout.id}
                  </td>

                  <td>
                    #{payout.order_id}
                  </td>

                  <td>
                    {payout.seller_name ||
                      "Unknown"}
                    <br />
                    {payout.seller_email ||
                      ""}
                  </td>

                  <td>
                    ₹{payout.amount}
                  </td>

                  <td>
                    {payout.payout_status}
                  </td>

                  <td>
                    {payout.transaction_id ||
                      "Not available"}
                  </td>

                  <td>
                    {payout.paid_at
                      ? new Date(
                          payout.paid_at
                        ).toLocaleString()
                      : "Not paid"}
                  </td>

                  <td>
                    {new Date(
                      payout.created_at
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

export default AdminPayouts;