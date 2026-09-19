import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BookDetails.css";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Unable to load book"
          );
          return;
        }

        setBook(data.product);
        setMessage("");
      } catch (error) {
        console.error(
          "Book details error:",
          error
        );

        setMessage(
          "Unable to connect to server"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBuyNow = () => {
    const token = localStorage.getItem(
      "token"
    );

    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        productId: book.id,
      },
    });
  };

  if (loading) {
    return (
      <div className="book-details">
        <h1>Loading book...</h1>
      </div>
    );
  }

  if (message || !book) {
    return (
      <div className="book-details">
        <h1>Book Not Found</h1>

        <p>
          {message ||
            "This book is not available."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/books")
          }
        >
          Back to Books
        </button>
      </div>
    );
  }

  const sellerPrice = Number(
    book.seller_price || 0
  );

  const platformFee = Number(
    book.platform_fee || 0
  );

  const buyerPrice = Number(
    book.buyer_price ||
      sellerPrice + platformFee
  );

  return (
    <div className="book-details">
      <div className="details-image">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={book.title}
          />
        ) : (
          <div>
            No Image Available
          </div>
        )}
      </div>

      <div className="details-content">
        <p>
          Book ID: #{book.id}
        </p>

        <h1>
          {book.title}
        </h1>

        <p>
          {book.description ||
            "No description provided."}
        </p>

        <hr />

        <p>
          <strong>
            Category:
          </strong>{" "}
          {book.category}
        </p>

        <p>
          <strong>
            Condition:
          </strong>{" "}
          {book.condition}
        </p>

        <p>
          <strong>
            Seller:
          </strong>{" "}
          {book.seller_name ||
            "Student Seller"}
        </p>

        <p>
          <strong>
            Location:
          </strong>{" "}
          {book.location ||
            "Not provided"}
        </p>

        <hr />

        <h2>
          Price Details
        </h2>

        <p>
          Seller Price:{" "}
          <strong>
            ₹{sellerPrice.toFixed(2)}
          </strong>
        </p>

        <p>
          Platform Fee:{" "}
          <strong>
            ₹{platformFee.toFixed(2)}
          </strong>
        </p>

        <p>
          Buyer Price:{" "}
          <strong>
            ₹{buyerPrice.toFixed(2)}
          </strong>
        </p>

        <br />

        <button
          type="button"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>

        {" "}

        <button
          type="button"
          onClick={() =>
            navigate("/books")
          }
        >
          Back to Books
        </button>
      </div>
    </div>
  );
}

export default BookDetails;