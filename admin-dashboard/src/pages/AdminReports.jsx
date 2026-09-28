import { useEffect, useState } from "react";
import "./AdminReports.css";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/reports",
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
            "Unable to load reports"
        );
        return;
      }

      setReports(data.reports || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Admin reports error:",
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
    fetchReports();
  }, []);

  const handleUpdateStatus = async (
    id,
    status
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/reports/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update report"
        );
        return;
      }

      setMessage(
        "Report status updated successfully."
      );

      await fetchReports();
    } catch (error) {
      console.error(
        "Update report error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    }
  };

  const filteredReports =
    reports.filter((report) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(report.id)
          .includes(searchText) ||
        (report.reporter_name || "")
          .toLowerCase()
          .includes(searchText) ||
        (report.reporter_email || "")
          .toLowerCase()
          .includes(searchText) ||
        (report.product_title || "")
          .toLowerCase()
          .includes(searchText) ||
        (report.reason || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        report.status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <main className="reports-page">

      {/* Background decoration */}
      <div className="reports-glow reports-glow-one"></div>
      <div className="reports-glow reports-glow-two"></div>

      <div className="reports-floating-icon reports-floating-one">
        ⚠️
      </div>

      <div className="reports-floating-icon reports-floating-two">
        📋
      </div>


      {/* Header */}
      <section className="reports-header">

        <div className="reports-icon">
          📋
        </div>

        <p className="reports-label">
          ADMIN CONTROL CENTER
        </p>

        <h1>
          User <span>Reports</span>
        </h1>

        <p className="reports-subtitle">
          Review reports submitted by users
          about book listings.
        </p>

      </section>


      {/* Message */}
      {message && (
        <div className="reports-message">

          <span className="reports-message-icon">
            {message.includes("successfully")
              ? "✓"
              : "⚠"}
          </span>

          <span>
            {message}
          </span>

        </div>
      )}


      {/* Report Database / Controls */}
      <section className="reports-controls">

        <div className="reports-controls-heading">

          <div className="reports-controls-icon">
            🚨
          </div>

          <div>

            <p className="reports-controls-label">
              REPORT DATABASE
            </p>

            <h2>
              All Reports
            </h2>

          </div>

        </div>


        <div className="reports-filters">

          <div className="report-search">

            <span className="report-search-icon">
              🔎
            </span>

            <input
              type="text"
              placeholder="Search report, user, book or reason..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <button
            type="button"
            className="report-clear-button"
            onClick={() =>
              setSearch("")
            }
          >
            Clear Search
          </button>


          <label className="report-status-filter">

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

              <option value="reviewed">
                Reviewed
              </option>

              <option value="resolved">
                Resolved
              </option>

              <option value="rejected">
                Rejected
              </option>

            </select>

          </label>

        </div>

      </section>


      {/* Results */}
      <div className="reports-results">

        <span>
          Showing
        </span>

        <strong>
          {filteredReports.length}
        </strong>

        <span>
          of
        </span>

        <strong>
          {reports.length}
        </strong>

        <span>
          reports
        </span>

      </div>


      {/* Loading */}
      {loading ? (

        <div className="report-state">

          <span className="report-state-icon">
            ⏳
          </span>

          <p>
            Loading reports...
          </p>

        </div>

      ) : filteredReports.length === 0 ? (

        <div className="report-state">

          <span className="report-state-icon">
            📭
          </span>

          <h3>
            No Reports Found
          </h3>

          <p>
            There are currently no reports
            matching your search or filter.
          </p>

        </div>

      ) : (

        /* Report Table */
        <section className="reports-table-section">

          <div className="reports-table-top">

            <div>

              <p>
                USER REPORTS
              </p>

              <h2>
                Report History
              </h2>

            </div>

            <span className="report-count">
              {filteredReports.length} Records
            </span>

          </div>


          <div className="reports-table-wrapper">

            <table className="reports-table">

              <thead>

                <tr>
                  <th>Report ID</th>
                  <th>Reporter</th>
                  <th>Book</th>
                  <th>Reason</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {filteredReports.map(
                  (report) => (

                    <tr key={report.id}>

                      <td className="report-id">
                        #{report.id}
                      </td>


                      <td className="reporter-cell">

                        <strong>
                          {report.reporter_name ||
                            "Unknown"}
                        </strong>

                        <span>
                          {report.reporter_email ||
                            ""}
                        </span>

                      </td>


                      <td className="report-book">
                        <span className="book-icon">
                          📖
                        </span>

                        {report.product_title ||
                          "Product removed"}
                      </td>


                      <td className="report-reason">
                        {report.reason}
                      </td>


                      <td className="report-description">
                        {report.description ||
                          "No description"}
                      </td>


                      <td>

                        <span
                          className={`report-status report-status-${report.status}`}
                        >
                          {report.status}
                        </span>

                      </td>


                      <td className="report-date">
                        {new Date(
                          report.created_at
                        ).toLocaleString()}
                      </td>


                      <td className="report-actions">

                        <button
                          type="button"
                          className="report-action-reviewed"
                          onClick={() =>
                            handleUpdateStatus(
                              report.id,
                              "reviewed"
                            )
                          }
                        >
                          ✓ Reviewed
                        </button>


                        <button
                          type="button"
                          className="report-action-resolve"
                          onClick={() =>
                            handleUpdateStatus(
                              report.id,
                              "resolved"
                            )
                          }
                        >
                          ✓ Resolve
                        </button>


                        <button
                          type="button"
                          className="report-action-reject"
                          onClick={() =>
                            handleUpdateStatus(
                              report.id,
                              "rejected"
                            )
                          }
                        >
                          ✕ Reject
                        </button>

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

export default AdminReports;