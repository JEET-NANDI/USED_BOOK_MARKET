import { useEffect, useMemo, useState } from "react";
import "./AdminReports.css";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchReports() {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required. Please sign in to continue.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:5000/api/admin/reports", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load reports.");
        return;
      }

      setReports(data.reports || []);
    } catch (error) {
      console.error("Admin reports error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  async function handleUpdateStatus(id, status) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required. Please sign in to continue.");
      return;
    }

    try {
      setUpdatingId(id);
      setMessage("");

      const response = await fetch(
        `http://localhost:5000/api/admin/reports/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to update report.");
        return;
      }

      setMessage("Report status updated successfully.");
      await fetchReports();
    } catch (error) {
      console.error("Update report error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredReports = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        !searchText ||
        String(report.id ?? "").toLowerCase().includes(searchText) ||
        (report.reporter_name || "").toLowerCase().includes(searchText) ||
        (report.reporter_email || "").toLowerCase().includes(searchText) ||
        (report.product_title || "").toLowerCase().includes(searchText) ||
        (report.reason || "").toLowerCase().includes(searchText) ||
        (report.description || "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        (report.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const countByStatus = (status) =>
    reports.filter(
      (report) => (report.status || "").toLowerCase() === status
    ).length;

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleString();
  }

  function getStatusClass(status) {
    const normalizedStatus = (status || "unknown").toLowerCase();
    const knownStatuses = ["pending", "reviewed", "resolved", "rejected"];

    return knownStatuses.includes(normalizedStatus)
      ? `report-status-${normalizedStatus}`
      : "report-status-default";
  }

  return (
    <main className="reports-page">
      <div className="reports-shell">
        <header className="reports-header">
          <div>
            <p className="reports-eyebrow">Admin control center</p>
            <h1 className="reports-title">Product Reports</h1>
            <p className="reports-description">
              Review reports submitted by users about book listings.
            </p>
          </div>

          <button
            className="reports-refresh-button"
            type="button"
            onClick={fetchReports}
            disabled={loading}
          >
            <span className="reports-refresh-icon" aria-hidden="true">
              ↻
            </span>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        <section className="reports-summary-grid" aria-label="Report summary">
          <article className="reports-summary-card reports-total-card">
            <div className="reports-summary-icon" aria-hidden="true">
              📋
            </div>
            <div>
              <p className="reports-summary-label">Total reports</p>
              <p className="reports-summary-value">{reports.length}</p>
              <p className="reports-summary-note">All submitted reports</p>
            </div>
          </article>

          <article className="reports-summary-card reports-pending-card">
            <div className="reports-summary-icon" aria-hidden="true">
              ⏳
            </div>
            <div>
              <p className="reports-summary-label">Pending review</p>
              <p className="reports-summary-value">{countByStatus("pending")}</p>
              <p className="reports-summary-note">Needs your attention</p>
            </div>
          </article>

          <article className="reports-summary-card reports-resolved-card">
            <div className="reports-summary-icon" aria-hidden="true">
              ✅
            </div>
            <div>
              <p className="reports-summary-label">Resolved</p>
              <p className="reports-summary-value">{countByStatus("resolved")}</p>
              <p className="reports-summary-note">Successfully handled</p>
            </div>
          </article>

          <article className="reports-summary-card reports-rejected-card">
            <div className="reports-summary-icon" aria-hidden="true">
              ✕
            </div>
            <div>
              <p className="reports-summary-label">Rejected</p>
              <p className="reports-summary-value">{countByStatus("rejected")}</p>
              <p className="reports-summary-note">Reports declined</p>
            </div>
          </article>
        </section>

        <section className="reports-panel">
          <div className="reports-toolbar">
            <div className="reports-toolbar-heading">
              <p className="reports-section-eyebrow">Report directory</p>
              <h2 className="reports-toolbar-title">Find Reports</h2>
              <p className="reports-count">
                Showing <strong>{filteredReports.length}</strong> of{" "}
                <strong>{reports.length}</strong> reports
              </p>
            </div>

            <div className="reports-controls">
              <div className="reports-search-wrap">
                <span className="reports-search-icon" aria-hidden="true">
                  ⌕
                </span>
                <input
                  className="reports-search-input"
                  type="search"
                  placeholder="Search user, book or reason..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search reports"
                />
              </div>

              {search && (
                <button
                  className="reports-clear-button"
                  type="button"
                  onClick={() => setSearch("")}
                >
                  Clear
                </button>
              )}

              <select
                className="reports-status-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter reports by status"
              >
                <option value="All">All statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {message && (
            <div className="reports-notice" role="status">
              {message}
            </div>
          )}

          {loading ? (
            <div className="reports-loading" role="status">
              <div className="reports-spinner" />
              Loading reports...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="reports-empty">
              <div className="reports-empty-icon" aria-hidden="true">
                🔎
              </div>
              <strong>No reports found</strong>
              <p>Try changing your search or selecting a different status.</p>
            </div>
          ) : (
            <div className="reports-table-scroll">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Reporter</th>
                    <th>Book</th>
                    <th>Reason</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created at</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => {
                    const status = (report.status || "unknown").toLowerCase();
                    const isUpdating = updatingId === report.id;

                    return (
                      <tr key={report.id}>
                        <td className="reports-id">#{report.id}</td>

                        <td>
                          <span className="reports-reporter-name">
                            {report.reporter_name || "Unknown"}
                          </span>
                          {report.reporter_email && (
                            <span className="reports-reporter-email">
                              {report.reporter_email}
                            </span>
                          )}
                        </td>

                        <td className="reports-book-title">
                          {report.product_title || "Product removed"}
                        </td>

                        <td>{report.reason || "Not specified"}</td>

                        <td
                          className="reports-description-cell"
                          title={report.description || "No description"}
                        >
                          {report.description || "No description"}
                        </td>

                        <td>
                          <span
                            className={`reports-status-badge ${getStatusClass(
                              status
                            )}`}
                          >
                            <span className="reports-status-dot" />
                            {status}
                          </span>
                        </td>

                        <td>{formatDate(report.created_at)}</td>

                        <td>
                          <div className="reports-action-group">
                            <button
                              className="reports-action-button reports-reviewed-button"
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(report.id, "reviewed")
                              }
                              disabled={isUpdating || status === "reviewed"}
                            >
                              Reviewed
                            </button>

                            <button
                              className="reports-action-button reports-resolve-button"
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(report.id, "resolved")
                              }
                              disabled={isUpdating || status === "resolved"}
                            >
                              Resolve
                            </button>

                            <button
                              className="reports-action-button reports-reject-button"
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(report.id, "rejected")
                              }
                              disabled={isUpdating || status === "rejected"}
                            >
                              Reject
                            </button>
                          </div>
                          {isUpdating && (
                            <span className="reports-updating-label">
                              Updating...
                            </span>
                          )}
                        </td>
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

export default AdminReports;