import { useEffect, useState } from "react";

function AdminShipping() {
  const [shipments, setShipments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/shipping",
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
            "Unable to load shipping records"
        );
        return;
      }

      setShipments(data.shipments || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Admin shipping error:",
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
    fetchShipments();
  }, []);

  const filteredShipments =
    shipments.filter((shipment) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(shipment.id)
          .includes(searchText) ||
        String(shipment.order_id)
          .includes(searchText) ||
        (shipment.tracking_number || "")
          .toLowerCase()
          .includes(searchText) ||
        (shipment.courier_name || "")
          .toLowerCase()
          .includes(searchText) ||
        (shipment.buyer_name || "")
          .toLowerCase()
          .includes(searchText) ||
        (shipment.seller_name || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        shipment.shipping_status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <div>
      <h1>Shipping</h1>

      <p>
        Monitor shipment and delivery
        information for orders.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Search order, tracking, courier, buyer..."
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

            <option value="shipped">
              Shipped
            </option>

            <option value="in_transit">
              In Transit
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </label>
      </div>

      <br />

      <p>
        Showing{" "}
        <strong>
          {filteredShipments.length}
        </strong>{" "}
        of{" "}
        <strong>
          {shipments.length}
        </strong>{" "}
        shipments
      </p>

      {loading ? (
        <p>
          Loading shipping records...
        </p>
      ) : filteredShipments.length === 0 ? (
        <p>
          No shipping records found.
        </p>
      ) : (
        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>Shipping ID</th>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Courier</th>
              <th>Tracking Number</th>
              <th>Status</th>
              <th>Shipped At</th>
              <th>Delivered At</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredShipments.map(
              (shipment) => (
                <tr key={shipment.id}>
                  <td>
                    #{shipment.id}
                  </td>

                  <td>
                    #{shipment.order_id}
                  </td>

                  <td>
                    {shipment.buyer_name ||
                      "Unknown"}
                    <br />
                    {shipment.buyer_email ||
                      ""}
                  </td>

                  <td>
                    {shipment.seller_name ||
                      "Unknown"}
                    <br />
                    {shipment.seller_email ||
                      ""}
                  </td>

                  <td>
                    {shipment.courier_name ||
                      "Not assigned"}
                  </td>

                  <td>
                    {shipment.tracking_number ||
                      "Not assigned"}
                  </td>

                  <td>
                    {shipment.shipping_status}
                  </td>

                  <td>
                    {shipment.shipped_at
                      ? new Date(
                          shipment.shipped_at
                        ).toLocaleString()
                      : "Not shipped"}
                  </td>

                  <td>
                    {shipment.delivered_at
                      ? new Date(
                          shipment.delivered_at
                        ).toLocaleString()
                      : "Not delivered"}
                  </td>

                  <td>
                    {new Date(
                      shipment.created_at
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

export default AdminShipping;