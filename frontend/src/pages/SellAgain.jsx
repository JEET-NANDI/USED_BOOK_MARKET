import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function SellAgain() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [sellerPrice, setSellerPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPurchasedBook = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/orders/${productId}/sell-again`,
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
            "Unable to load purchased book."
        );
        return;
      }

      const product = data.product;

      setBook(product);
      setCondition(
        product.condition || ""
      );
      setDescription(
        product.description || ""
      );
      setLocation(
        product.location || ""
      );
    } catch (error) {
      console.error(
        "Sell again error:",
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
    fetchPurchasedBook();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    if (!sellerPrice) {
      setMessage(
        "Seller price is required."
      );
      return;
    }

    if (Number(sellerPrice) <= 0) {
      setMessage(
        "Seller price must be greater than 0."
      );
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await fetch(
        `http://localhost:5000/api/products/sell-again/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            seller_price:
              Number(sellerPrice),
            condition,
            description,
            location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to create listing."
        );
        return;
      }

      setMessage(
        "Book submitted for admin approval."
      );

      setTimeout(() => {
        navigate("/listings");
      }, 1000);
    } catch (error) {
      console.error(
        "Sell again submit error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1>Sell Again</h1>
        <p>
          Loading purchased book...
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <h1>Sell Again</h1>

        <p>
          {message ||
            "Purchased book not found."}
        </p>

        <Link to="/orders">
          <button type="button">
            Back to Orders
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Sell Again</h1>

      <p>
        Create a new listing for a book
        you previously purchased.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <hr />

      <h2>
        Book Information
      </h2>

      <p>
        <strong>
          Title:
        </strong>{" "}
        {book.title}
      </p>

      <p>
        <strong>
          Category:
        </strong>{" "}
        {book.category}
      </p>

      <p>
        <strong>
          Original Seller:
        </strong>{" "}
        {book.seller_name ||
          "Student Seller"}
      </p>

      <hr />

      <h2>
        New Listing
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Your Seller Price:
            {" "}

            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter your selling price"
              value={sellerPrice}
              onChange={(e) =>
                setSellerPrice(
                  e.target.value
                )
              }
              required
            />
          </label>
        </div>

        <br />

        <div>
          <label>
            Condition:
            {" "}

            <select
              value={condition}
              onChange={(e) =>
                setCondition(
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Select condition
              </option>

              <option value="Like New">
                Like New
              </option>

              <option value="Good">
                Good
              </option>

              <option value="Used">
                Used
              </option>
            </select>
          </label>
        </div>

        <br />

        <div>
          <label>
            Description:
          </label>

          <br />

          <textarea
            rows="5"
            placeholder="Describe the current condition of the book..."
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />
        </div>

        <br />

        <div>
          <label>
            Location:
            {" "}

            <input
              type="text"
              placeholder="Your location"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
            />
          </label>
        </div>

        <br />

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "Submit for Approval"}
        </button>
      </form>

      <br />

      <Link to="/orders">
        Back to Orders
      </Link>
    </div>
  );
}

export default SellAgain;