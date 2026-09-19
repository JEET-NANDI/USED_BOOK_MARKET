import { useEffect, useState } from "react";

function PendingProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/products/pending",
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
            "Unable to load pending products"
        );
        return;
      }

      setProducts(data.products || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Pending products error:",
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
    fetchPendingProducts();
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/products/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to approve product"
        );
        return;
      }

      setMessage(
        "Book listing approved successfully."
      );

      await fetchPendingProducts();
    } catch (error) {
      console.error(
        "Approve product error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Admin login required");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/products/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to reject product"
        );
        return;
      }

      setMessage(
        "Book listing rejected successfully."
      );

      await fetchPendingProducts();
    } catch (error) {
      console.error(
        "Reject product error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    }
  };

  return (
    <div>
      <h1>Pending Products</h1>

      <p>
        Review book listings before making
        them available to buyers.
      </p>

      {message && (
        <p>{message}</p>
      )}

      {loading ? (
        <p>
          Loading pending products...
        </p>
      ) : products.length === 0 ? (
        <p>
          No pending products found.
        </p>
      ) : (
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map(
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
                    <button
                      type="button"
                      onClick={() =>
                        handleApprove(
                          product.id
                        )
                      }
                    >
                      Approve
                    </button>

                    {" "}

                    <button
                      type="button"
                      onClick={() =>
                        handleReject(
                          product.id
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

export default PendingProducts;