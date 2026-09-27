import { useEffect, useState } from "react";
import "./AdminShipping.css";

function AdminShipping() {
  const [shipments, setShipments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    courier_name: "",
    tracking_number: "",
    shipping_status: "shipped",
  });
  const [updating, setUpdating] = useState(false);

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

      setShipments(data.shipments || data.shipping || []);
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

  const startEdit = (shipment) => {
    setEditingId(shipment.id);
    setEditForm({
      courier_name: shipment.courier_name || "",
      tracking_number: shipment.tracking_number || "",
      shipping_status: shipment.shipping_status || "shipped",
    });
  };

  const saveShipment = async (shipmentId, payload) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Admin login required");
      return false;
    }
    try {
      setUpdating(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/shipping/${shipmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Unable to update shipping");
        return false;
      }
      setShipments((current) =>
        current.map((item) =>
          item.id === shipmentId
            ? {
                ...item,
                courier_name:
                  payload.courier_name !== undefined
                    ? payload.courier_name || item.courier_name
                    : item.courier_name,
                tracking_number:
                  payload.tracking_number !== undefined
                    ? payload.tracking_number || item.tracking_number
                    : item.tracking_number,
                shipping_status:
                  payload.shipping_status || item.shipping_status,
              }
            : item
        )
      );
      return true;
    } catch (error) {
      console.error("Update shipping error:", error);
      setMessage("Unable to connect to server");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async (shipmentId) => {
    const ok = await saveShipment(shipmentId, {
      courier_name: editForm.courier_name.trim() || undefined,
      tracking_number: editForm.tracking_number.trim() || undefined,
      shipping_status: editForm.shipping_status,
    });
    if (!ok) return;
    setEditingId(null);
    setMessage(
      `Shipping #${shipmentId} saved as ${editForm.shipping_status}. User order tracking updated.`
    );
  };

  const handleQuickStatus = async (shipmentId, nextStatus) => {
    if (
      !window.confirm(
        `Set shipping #${shipmentId} to ${nextStatus}? User will see order tracking update.`
      )
    )
      return;
    const ok = await saveShipment(shipmentId, {
      shipping_status: nextStatus,
    });
    if (!ok) return;
    setMessage(
      `Shipping #${shipmentId} is now ${nextStatus}. User sees updated tracking.`
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "ship-status pending";
      case "shipped":
        return "ship-status shipped";
      case "in_transit":
        return "ship-status in-transit";
      case "delivered":
        return "ship-status delivered";
      case "cancelled":
        return "ship-status cancelled";
      default:
        return "ship-status default";
    }
  };

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

  const countBy = (status) =>
    shipments.filter((item) => item.shipping_status === status).length;

  return (
    <main className="admin-shipping-page">
      <div className="admin-shipping-bg bg-one"></div>
      <div className="admin-shipping-bg bg-two"></div>

      <div className="admin-shipping-floating-book book-one">🚚</div>
      <div className="admin-shipping-floating-book book-two">📦</div>

      <section className="admin-shipping-header">
        <div className="admin-shipping-icon">🚚</div>
        <p className="admin-shipping-label">ADMIN CONTROL CENTER</p>
        <h1>
          Shipping <span>Management</span>
        </h1>
        <p>
          Choose pending / shipped / in-transit / delivered, press Save —
          user order tracking updates automatically.
        </p>
        <div className="admin-shipping-header-line"></div>
      </section>

      {message && (
        <div className="admin-shipping-message">⚠️ {message}</div>
      )}

      <section className="admin-shipping-toolbar">
        <div className="admin-shipping-toolbar-heading">
          <div className="toolbar-icon">🔎</div>
          <div>
            <small>SHIPMENT DATABASE</small>
            <h2>All Shipments</h2>
          </div>
        </div>

        <div className="admin-shipping-controls">
          <div className="admin-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search order, tracking, courier, buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="admin-clear-button"
            onClick={() => setSearch("")}
          >
            Clear
          </button>

          <div className="admin-status-filter">
            <label htmlFor="admin-shipping-status">Status</label>
            <select
              id="admin-shipping-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      <section className="admin-shipping-summary">
        <div className="summary-item">
          <span className="summary-icon">📦</span>
          <div>
            <small>TOTAL</small>
            <strong>{shipments.length}</strong>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon orange">⏳</span>
          <div>
            <small>PENDING</small>
            <strong>{countBy("pending")}</strong>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon teal">🚚</span>
          <div>
            <small>SHIPPED</small>
            <strong>{countBy("shipped") + countBy("in_transit")}</strong>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon green">✓</span>
          <div>
            <small>DELIVERED</small>
            <strong>{countBy("delivered")}</strong>
          </div>
        </div>
      </section>

      <section className="admin-shipping-content">
        {loading ? (
          <div className="admin-shipping-loading">
            <div className="admin-shipping-spinner"></div>
            <h2>Loading Shipments...</h2>
            <p>Fetching shipment information from the marketplace.</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="admin-shipping-empty">
            <div className="empty-icon">📭</div>
            <p>NO SHIPMENTS FOUND</p>
            <h2>No matching shipments</h2>
            <span>Try changing your search or status filter.</span>
          </div>
        ) : (
          <div className="admin-shipping-table-wrapper">
            <table className="admin-shipping-table">
              <thead>
                <tr>
                  <th>Ship</th>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th>Courier</th>
                  <th>Tracking</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment, index) => (
                  <tr
                    key={shipment.id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td>
                      <div className="ship-id-cell">
                        <span className="ship-box-icon">🚚</span>
                        <strong>#{shipment.id}</strong>
                      </div>
                    </td>
                    <td>
                      <strong>#{shipment.order_id}</strong>
                      <small className="order-book-name">
                        {shipment.product_title || ""}
                      </small>
                    </td>
                    <td>
                      <div className="person-cell">
                        <div className="person-avatar">👤</div>
                        <div>
                          <strong>
                            {shipment.buyer_name || "Buyer"}
                          </strong>
                          <small>{shipment.buyer_email || "-"}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {editingId === shipment.id ? (
                        <input
                          className="ship-inline-input"
                          type="text"
                          placeholder="Courier"
                          value={editForm.courier_name}
                          onChange={(e) =>
                            setEditForm((current) => ({
                              ...current,
                              courier_name: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <span className="courier-value">
                          {shipment.courier_name || "—"}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === shipment.id ? (
                        <input
                          className="ship-inline-input"
                          type="text"
                          placeholder="Tracking no."
                          value={editForm.tracking_number}
                          onChange={(e) =>
                            setEditForm((current) => ({
                              ...current,
                              tracking_number: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <span className="tracking-value">
                          {shipment.tracking_number || "—"}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === shipment.id ? (
                        <select
                          className="ship-inline-select"
                          value={editForm.shipping_status}
                          onChange={(e) =>
                            setEditForm((current) => ({
                              ...current,
                              shipping_status: e.target.value,
                            }))
                          }
                        >
                          <option value="pending">pending</option>
                          <option value="shipped">shipped</option>
                          <option value="in_transit">in_transit</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      ) : (
                        <span className={getStatusClass(shipment.shipping_status)}>
                          <span className="status-dot"></span>
                          {shipment.shipping_status}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === shipment.id ? (
                        <div className="ship-action-cell">
                          <button
                            type="button"
                            className="ship-action-button save-button"
                            disabled={updating}
                            onClick={() => handleUpdate(shipment.id)}
                          >
                            {updating ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            className="ship-action-button cancel-button"
                            onClick={() => setEditingId(null)}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="ship-action-cell">
                          <button
                            type="button"
                            className="ship-action-button handle-button"
                            onClick={() => startEdit(shipment)}
                          >
                            Handle ✏️
                          </button>
                          {shipment.shipping_status === "pending" && (
                            <button
                              type="button"
                              className="ship-action-button quick-ship-button"
                              disabled={updating}
                              onClick={() =>
                                handleQuickStatus(shipment.id, "shipped")
                              }
                            >
                              Ship 🚚
                            </button>
                          )}
                          {(shipment.shipping_status === "shipped" ||
                            shipment.shipping_status === "in_transit") && (
                            <button
                              type="button"
                              className="ship-action-button quick-deliver-button"
                              disabled={updating}
                              onClick={() =>
                                handleQuickStatus(shipment.id, "delivered")
                              }
                            >
                              Deliver ✓
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-shipping-footer">
        <div className="footer-icon">📊</div>
        <div>
          <h2>Shipment Overview</h2>
          <p>
            Whatever you Save here, the user sees in My Orders tracking —
            shipped, in-transit or delivered.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AdminShipping;
