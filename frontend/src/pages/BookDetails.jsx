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
          setMessage(data.message || "Unable to load book");
          return;
        }

        setBook(data.product);
        setMessage("");
      } catch (error) {
        console.error("Book details error:", error);
        setMessage("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBuyNow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/checkout/${book.id}`);
  };

  if (loading) {
    return (
      <main className="book-details-page">
        <div className="details-loading">
          <div className="loading-books">
            <span>📕</span>
            <span>📗</span>
            <span>📘</span>
          </div>

          <h1>Loading Book...</h1>
          <p>Preparing the book details for you.</p>
        </div>
      </main>
    );
  }

  if (message || !book) {
    return (
      <main className="book-details-page">
        <div className="details-error">
          <div className="error-icon">📕</div>

          <h1>Book Not Found</h1>

          <p>
            {message || "This book is not available."}
          </p>

          <button
            type="button"
            className="details-back-button"
            onClick={() => navigate("/books")}
          >
            ← Back to Books
          </button>
        </div>
      </main>
    );
  }

  const sellerPrice = Number(book.seller_price || 0);

  const platformFee = Number(book.platform_fee || 0);

  const buyerPrice = Number(
    book.buyer_price || sellerPrice + platformFee
  );

  return (
    <main className="book-details-page">

      {/* Animated Background */}
      <div className="details-bg-circle circle-one"></div>
      <div className="details-bg-circle circle-two"></div>

      <div className="details-floating-book floating-one">
        📚
      </div>

      <div className="details-floating-book floating-two">
        📖
      </div>

      <div className="details-floating-book floating-three">
        📘
      </div>

      {/* Header */}
      <section className="details-header">
        <p className="details-label">
          STUDENT BOOK MARKETPLACE
        </p>

        <h1>
          Book <span>Details</span>
        </h1>

        <p>
          Explore the book information, pricing and seller details.
        </p>

        <div className="details-header-line"></div>
      </section>

      {/* Main Details */}
      <section className="details-container">

        {/* Image Section */}
        <div className="details-image-card">

          <div className="image-top-badge">
            📚 BOOK #{book.id}
          </div>

          <div className="details-image">

            {book.image_url ? (
              <img
                src={book.image_url}
                alt={book.title}
              />
            ) : (
              <div className="details-no-image">
                <span>📚</span>
                <p>No Image Available</p>
              </div>
            )}

            <div className="image-shine"></div>
          </div>

          <div className="image-bottom-info">
            <span>
              {book.condition || "Used"}
            </span>

            <span>
              {book.category || "General"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="details-content">

          <div className="details-category">
            {book.category || "GENERAL"}
          </div>

          <h2 className="details-title">
            {book.title}
          </h2>

          <p className="details-description">
            {book.description ||
              "No description provided for this book."}
          </p>

          <div className="details-divider"></div>

          {/* Information */}
          <div className="book-information">

            <div className="info-item">
              <span className="info-icon">📂</span>

              <div>
                <small>Category</small>
                <strong>
                  {book.category || "Not provided"}
                </strong>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">✨</span>

              <div>
                <small>Condition</small>
                <strong>
                  {book.condition || "Not provided"}
                </strong>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">👤</span>

              <div>
                <small>Seller</small>
                <strong>
                  {book.seller_name || "Student Seller"}
                </strong>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📍</span>

              <div>
                <small>Location</small>
                <strong>
                  {book.location || "Not provided"}
                </strong>
              </div>
            </div>

          </div>

          {/* Pricing */}
          <div className="price-section">

            <div className="price-section-title">
              <span>💰</span>
              <h3>Price Details</h3>
            </div>

            <div className="price-row">
              <span>Seller Price</span>

              <strong>
                ₹{sellerPrice.toFixed(2)}
              </strong>
            </div>

            <div className="price-row fee-price">
              <span>Platform Fee</span>

              <strong>
                ₹{platformFee.toFixed(2)}
              </strong>
            </div>

            <div className="price-total">
              <div>
                <span>Buyer Price</span>
                <small>Final marketplace price</small>
              </div>

              <strong>
                ₹{buyerPrice.toFixed(2)}
              </strong>
            </div>

          </div>

          {/* Buttons */}
          <div className="details-actions">

            <button
              type="button"
              className="buy-button"
              onClick={handleBuyNow}
            >
              <span>🛒</span>
              <span>Buy Now</span>
              <span className="button-arrow">→</span>
            </button>

            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/books")}
            >
              ← Back to Books
            </button>

          </div>

        </div>
      </section>

      {/* Bottom Message */}
      <section className="details-footer-card">

        <div className="footer-book-icon">
          📖
        </div>

        <div>
          <h3>
            Give This Book a Second Life
          </h3>

          <p>
            Buy affordable study materials from other students
            and keep useful books in circulation.
          </p>
        </div>

      </section>

    </main>
  );
}

export default BookDetails;