import { useEffect, useState } from "react";

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
    <div>
      <h1>Reports</h1>

      <p>
        Review reports submitted by
        users about book listings.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Search report, user, book or reason..."
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

      <br />

      <p>
        Showing{" "}
        <strong>
          {filteredReports.length}
        </strong>{" "}
        of{" "}
        <strong>
          {reports.length}
        </strong>{" "}
        reports
      </p>

      {loading ? (
        <p>
          Loading reports...
        </p>
      ) : filteredReports.length === 0 ? (
        <p>
          No reports found.
        </p>
      ) : (
        <table
          border="1"
          cellPadding="10"
        >
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
                  <td>
                    #{report.id}
                  </td>

                  <td>
                    {report.reporter_name ||
                      "Unknown"}
                    <br />
                    {report.reporter_email ||
                      ""}
                  </td>

                  <td>
                    {report.product_title ||
                      "Product removed"}
                  </td>

                  <td>
                    {report.reason}
                  </td>

                  <td>
                    {report.description ||
                      "No description"}
                  </td>

                  <td>
                    {report.status}
                  </td>

                  <td>
                    {new Date(
                      report.created_at
                    ).toLocaleString()}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          report.id,
                          "reviewed"
                        )
                      }
                    >
                      Reviewed
                    </button>

                    {" "}

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          report.id,
                          "resolved"
                        )
                      }
                    >
                      Resolve
                    </button>

                    {" "}

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(
                          report.id,
                          "rejected"
                        )
                      }
                    >
                      Reject
                    </button>
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

export default AdminReports;