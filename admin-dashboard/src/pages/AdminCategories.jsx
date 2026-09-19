import { useEffect, useState } from "react";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/categories",
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
            "Unable to load categories"
        );
        return;
      }

      setCategories(data.categories || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Categories error:",
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
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      return;
    }

    if (!name.trim()) {
      setMessage(
        "Category name is required"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to create category"
        );
        return;
      }

      setMessage(
        "Category created successfully."
      );

      setName("");
      setDescription("");

      await fetchCategories();
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    }
  };

  const handleDeleteCategory = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to delete category"
        );
        return;
      }

      setMessage(
        "Category deleted successfully."
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    }
  };

  const filteredCategories =
    categories.filter((category) => {
      const searchText =
        search.toLowerCase();

      return (
        category.name
          .toLowerCase()
          .includes(searchText) ||
        (category.description || "")
          .toLowerCase()
          .includes(searchText)
      );
    });

  return (
    <div>
      <h1>Categories</h1>

      <p>
        Manage book categories used
        throughout USED BOOK MARKET.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <hr />

      <h2>Add Category</h2>

      <form onSubmit={handleAddCategory}>
        <div>
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <textarea
            placeholder="Category description"
            rows="4"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />
        </div>

        <br />

        <button type="submit">
          Add Category
        </button>
      </form>

      <hr />

      <h2>Category List</h2>

      <input
        type="text"
        placeholder="Search categories..."
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

      <br />
      <br />

      {loading ? (
        <p>
          Loading categories...
        </p>
      ) : filteredCategories.length === 0 ? (
        <p>
          No categories found.
        </p>
      ) : (
        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.map(
              (category) => (
                <tr key={category.id}>
                  <td>
                    {category.id}
                  </td>

                  <td>
                    {category.name}
                  </td>

                  <td>
                    {category.description ||
                      "No description"}
                  </td>

                  <td>
                    {new Date(
                      category.created_at
                    ).toLocaleString()}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteCategory(
                          category.id
                        )
                      }
                    >
                      Delete
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

export default AdminCategories;