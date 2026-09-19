import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login to view your wishlist."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/wishlist",
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
            "Unable to load wishlist."
        );
        return;
      }

      setWishlist(
        data.wishlist || []
      );
      setMessage("");
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (
    productId
  ) => {
    const token = localStorage.getItem(
      "token"
    );

    if (!token) {
      setMessage(
        "Please login first."
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/wishlist/${productId}`,
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
            "Unable to remove item."
        );
        return;
      }

      setWishlist((current) =>
        current.filter(
          (item) =>
            item.product_id !==
            productId
        )
      );

      setMessage(
        "Book removed from wishlist."
      );
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );
    }
  };

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>

      <p>
        Save books that you may want
        to buy later.
      </p>

      {message && (
        <p>{message}</p>
      )}

      {!localStorage.getItem("token") ? (
        <div>
          <p>
            Please login to manage
            your wishlist.
          </p>

          <Link to="/login">
            <button type="button">
              Login
            </button>
          </Link>
        </div>
      ) : loading ? (
        <p>
          Loading wishlist...
        </p>
      ) : wishlist.length === 0 ? (
        <div>
          <p>
            Your wishlist is empty.
          </p>

          <Link to="/books">
            <button type="button">
              Browse Books
            </button>
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(
            (item) => (
              <div
                className="wishlist-card"
                key={item.id}
              >
                <div>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={
                        item.product_title
                      }
                    />
                  ) : (
                    <div>
                      No Image
                    </div>
                  )}
                </div>

                <h2>
                  {item.product_title}
                </h2>

                <p>
                  Category:{" "}
                  {item.category}
                </p>

                <p>
                  Condition:{" "}
                  {item.condition}
                </p>

                <p>
                  Seller:{" "}
                  {item.seller_name ||
                    "Student Seller"}
                </p>

                <p>
                  Seller Price:{" "}
                  <strong>
                    ₹
                    {item.seller_price}
                  </strong>
                </p>

                <p>
                  Buyer Price:{" "}
                  <strong>
                    ₹
                    {item.buyer_price ||
                      item.seller_price}
                  </strong>
                </p>

                <div>
                  <Link
                    to={`/books/${item.product_id}`}
                  >
                    <button type="button">
                      View Book
                    </button>
                  </Link>

                  {" "}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(
                        item.product_id
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Wishlist;