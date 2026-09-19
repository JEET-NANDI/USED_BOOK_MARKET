import { useEffect, useState } from "react";

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
        setMessage(
          data.message ||
            "Unable to load payments"
        );
        return;
      }

      setPayments(data.payments || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Admin payments error:",
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
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (payment) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(payment.id)
          .includes(searchText) ||
        String(payment.order_id)
          .includes(searchText) ||
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
        payment.payment_status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  return (
    <div>
      <h1>Payments</h1>

      <p>
        Monitor payments made for
        book orders.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Search payment, order, buyer or transaction..."
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

            <option value="paid">
              Paid
            </option>

            <option value="failed">
              Failed
            </option>

            <option value="refunded">
              Refunded
            </option>
          </select>
        </label>
      </div>

      <br />

      <p>
        Showing{" "}
        <strong>
          {filteredPayments.length}
        </strong>{" "}
        of{" "}
        <strong>
          {payments.length}
        </strong>{" "}
        payments
      </p>

      {loading ? (
        <p>
          Loading payments...
        </p>
      ) : filteredPayments.length === 0 ? (
        <p>
          No payments found.
        </p>
      ) : (
        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th>Paid At</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map(
              (payment) => (
                <tr key={payment.id}>
                  <td>
                    #{payment.id}
                  </td>

                  <td>
                    #{payment.order_id}
                  </td>

                  <td>
                    {payment.buyer_name ||
                      "Unknown"}
                    <br />
                    {payment.buyer_email ||
                      ""}
                  </td>

                  <td>
                    ₹{payment.amount}
                  </td>

                  <td>
                    {payment.payment_method ||
                      "Not provided"}
                  </td>

                  <td>
                    {payment.payment_status}
                  </td>

                  <td>
                    {payment.transaction_id ||
                      "Not available"}
                  </td>

                  <td>
                    {payment.paid_at
                      ? new Date(
                          payment.paid_at
                        ).toLocaleString()
                      : "Not paid"}
                  </td>

                  <td>
                    {new Date(
                      payment.created_at
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

export default AdminPayments;