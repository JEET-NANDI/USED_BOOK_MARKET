import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/products",
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
          data.message || "Unable to load products"
        );
        return;
      }

      setProducts(data.products || []);
      setMessage("");
    } catch (error) {
      console.error("Products error:", error);

      setMessage(
        "Unable to connect to server"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        product.title
          .toLowerCase()
          .includes(searchText) ||
        product.seller_name
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        product.status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  const getStatusText = (status) => {
    if (status === "pending") {
      return "Pending";
    }

    if (status === "approved") {
      return "Approved";
    }

    if (status === "rejected") {
      return "Rejected";
    }

    return status;
  };

  return (
    <div>
      <h1>All Products</h1>

      <p>
        View and monitor all book listings
        submitted by sellers.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Search book, seller or category..."
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

            <option value="Pending">
              Pending
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>
        </label>
      </div>

      <br />

      <p>
        Showing{" "}
        <strong>
          {filteredProducts.length}
        </strong>{" "}
        of{" "}
        <strong>
          {products.length}
        </strong>{" "}
        products
      </p>

      {filteredProducts.length > 0 ? (
        <table
          border="1"
          cellPadding="10"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Book</th>
              <th>Seller</th>
              <th>Email</th>
              <th>Category</th>
              <th>Condition</th>
              <th>Seller Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map(
              (product) => (
                <tr key={product.id}>
                  <td>
                    {product.id}
                  </td>

                  <td>
                    {product.title}
                  </td>

                  <td>
                    {product.seller_name}
                  </td>

                  <td>
                    {product.seller_email}
                  </td>

                  <td>
                    {product.category}
                  </td>

                  <td>
                    {product.condition}
                  </td>

                  <td>
                    ₹{product.seller_price}
                  </td>

                  <td>
                    {product.location ||
                      "Not provided"}
                  </td>

                  <td>
                    {getStatusText(
                      product.status
                    )}
                  </td>

                  <td>
                    {new Date(
                      product.created_at
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
            No products found.
          </p>
        )
      )}
    </div>
  );
}

export default AdminProducts;