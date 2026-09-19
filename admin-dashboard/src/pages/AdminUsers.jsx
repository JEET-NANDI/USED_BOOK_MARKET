import { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Admin login required");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/users",
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
            data.message || "Unable to load users"
          );
          return;
        }

        setUsers(data.users || []);
      } catch (error) {
        console.error("Users error:", error);

        setMessage(
          "Unable to connect to server"
        );
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name
        .toLowerCase()
        .includes(searchText) ||
      user.email
        .toLowerCase()
        .includes(searchText);

    const matchesRole =
      roleFilter === "All" ||
      user.role === roleFilter;

    return (
      matchesSearch &&
      matchesRole
    );
  });

  return (
    <div>
      <h1>Users</h1>

      <p>
        Manage registered users of
        USED BOOK MARKET.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Search by name or email..."
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
          Clear
        </button>

        {" "}

        <label>
          Role:{" "}

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
          >
            <option value="All">
              All
            </option>

            <option value="user">
              User
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
        </label>
      </div>

      <br />

      <p>
        Total users:{" "}
        <strong>
          {filteredUsers.length}
        </strong>
      </p>

      {filteredUsers.length > 0 ? (
        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(
              (user) => (
                <tr key={user.id}>
                  <td>
                    {user.id}
                  </td>

                  <td>
                    {user.name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {user.role}
                  </td>

                  <td>
                    {new Date(
                      user.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        !message && (
          <p>
            No users found.
          </p>
        )
      )}
    </div>
  );
}

export default AdminUsers;