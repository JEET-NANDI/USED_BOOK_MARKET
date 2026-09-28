import { useEffect, useState } from "react";
import "./AdminCategories.css";

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
    <main className="categories-page">

      {/* Background decoration */}
      <div className="categories-glow categories-glow-one"></div>
      <div className="categories-glow categories-glow-two"></div>

      <div className="categories-floating-icon categories-floating-one">
        📚
      </div>

      <div className="categories-floating-icon categories-floating-two">
        📖
      </div>


      {/* Header */}
      <section className="categories-header">

        <div className="categories-icon">
          📚
        </div>

        <p className="categories-label">
          ADMIN CONTROL CENTER
        </p>

        <h1>
          Book <span>Categories</span>
        </h1>

        <p className="categories-subtitle">
          Manage book categories used
          throughout USED BOOK MARKET.
        </p>

      </section>


      {/* Message */}
      {message && (
        <div className="categories-message">
          <span className="categories-message-icon">
            {message.includes("successfully")
              ? "✓"
              : "⚠"}
          </span>

          <span>
            {message}
          </span>
        </div>
      )}


      {/* Add Category + Category Info */}
      <section className="category-management">

        {/* Add Category */}
        <div className="add-category-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              ➕
            </div>

            <div>
              <p>
                CATEGORY MANAGEMENT
              </p>

              <h2>
                Add Category
              </h2>
            </div>

          </div>


          <form
            onSubmit={handleAddCategory}
            className="category-form"
          >

            <div className="category-input-group">

              <label>
                Category Name
              </label>

              <input
                type="text"
                placeholder="Enter category name..."
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>


            <div className="category-input-group">

              <label>
                Description
              </label>

              <textarea
                placeholder="Enter category description..."
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />

            </div>


            <button
              type="submit"
              className="add-category-button"
            >
              <span>＋</span>
              Add Category
            </button>

          </form>

        </div>


        {/* Category Summary */}
        <div className="category-summary-card">

          <div className="summary-icon">
            📚
          </div>

          <p className="summary-label">
            TOTAL CATEGORIES
          </p>

          <strong>
            {categories.length}
          </strong>

          <span>
            Categories available
          </span>

          <div className="summary-line"></div>

          <p className="summary-info">
            Keep your marketplace
            organized with clear and
            useful book categories.
          </p>

        </div>

      </section>


      {/* Category List */}
      <section className="category-list-section">

        <div className="category-list-header">

          <div className="category-list-title">

            <div className="list-icon">
              🗂️
            </div>

            <div>
              <p>
                CATEGORY DATABASE
              </p>

              <h2>
                Category List
              </h2>
            </div>

          </div>


          <span className="category-count">
            {filteredCategories.length} Results
          </span>

        </div>


        {/* Search */}
        <div className="category-search-area">

          <div className="category-search">

            <span>
              🔎
            </span>

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <button
            type="button"
            className="category-clear-button"
            onClick={() =>
              setSearch("")
            }
          >
            Clear
          </button>

        </div>


        {/* Category Content */}
        {loading ? (

          <div className="category-state">
            <span>⏳</span>
            <p>
              Loading categories...
            </p>
          </div>

        ) : filteredCategories.length === 0 ? (

          <div className="category-state">
            <span>📂</span>
            <p>
              No categories found.
            </p>
          </div>

        ) : (

          <div className="categories-table-wrapper">

            <table className="categories-table">

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

                      <td className="category-id">
                        #{category.id}
                      </td>


                      <td className="category-name">
                        <span className="category-book-icon">
                          📖
                        </span>

                        {category.name}
                      </td>


                      <td className="category-description">
                        {category.description ||
                          "No description"}
                      </td>


                      <td className="category-date">
                        {new Date(
                          category.created_at
                        ).toLocaleString()}
                      </td>


                      <td>

                        <button
                          type="button"
                          className="delete-category-button"
                          onClick={() =>
                            handleDeleteCategory(
                              category.id
                            )
                          }
                        >
                          🗑 Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminCategories;