import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.dataset.theme === "dark"
  );

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load books");
        return;
      }

      setBooks(data.products || []);
      setMessage("");
    } catch (error) {
      console.error("Books error:", error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* Watch Dark Mode changes made by Navbar */
  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setDarkMode(root.dataset.theme === "dark");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const categories = [
    "All",
    ...new Set(books.map((book) => book.category)),
  ];

  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      book.title?.toLowerCase().includes(searchText) ||
      (book.description || "").toLowerCase().includes(searchText) ||
      (book.category || "").toLowerCase().includes(searchText) ||
      (book.seller_name || "").toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className={`books-page ${darkMode ? "dark-mode" : ""}`}>

      {/* Decorative floating books */}
      <div className="books-floating-book floating-book-one">
        📘
      </div>

      <div className="books-floating-book floating-book-two">
        📕
      </div>

      <div className="books-floating-book floating-book-three">
        📗
      </div>

      {/* Header */}
      <section className="books-header">

        <div className="books-header-icon">
          📚
        </div>

        <p className="books-label">
          STUDENT BOOK MARKETPLACE
        </p>

        <h1 className="books-title">
          Discover <span>Books</span> 📖
        </h1>

        <p className="books-subtitle">
          Browse approved used books available from student sellers.
        </p>

        <div className="books-header-line"></div>

      </section>

      {/* Search and Filter */}
      <section className="books-toolbar">

        <div className="search-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search books, categories or sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}

        </div>

        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="clear-btn"
          onClick={() => {
            setSearch("");
            setCategory("All");
          }}
        >
          ↻ Clear
        </button>

      </section>

      {/* Error Message */}
      {message && (
        <div className="books-message error-message">
          <span>⚠️</span>
          {message}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="books-status">

          <div className="loading-book-stack">
            <span>📕</span>
            <span>📗</span>
            <span>📘</span>
          </div>

          <h2>Loading Books...</h2>

          <p>
            Finding books available in the marketplace.
          </p>

        </div>

      ) : filteredBooks.length === 0 ? (

        /* Empty */
        <div className="books-status empty-status">

          <div className="empty-book">
            📕
          </div>

          <h2>No Books Found</h2>

          <p>
            Try another search or choose a different category.
          </p>

          <button
            type="button"
            className="empty-reset-button"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Show All Books
          </button>

        </div>

      ) : (

        <>

          {/* Result count */}
          <div className="books-results-bar">

            <div>

              <span className="results-small">
                MARKETPLACE COLLECTION
              </span>

              <p>
                Showing{" "}
                <strong>{filteredBooks.length}</strong>{" "}
                {filteredBooks.length === 1
                  ? "book"
                  : "books"}
              </p>

            </div>

            <div className="results-icon">
              📚
            </div>

          </div>

          {/* Books */}
          <section className="books-grid">

            {filteredBooks.map((book, index) => (

              <article
                className="book-card"
                key={book.id}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >

                {/* Book Image */}
                <div className="book-image">

                  <div className="book-image-shine"></div>

                  {book.image_url ? (
                    <img
                      src={`http://localhost:5000${book.image_url}`}
                      alt={book.title}
                    />
                  ) : (
                    <div className="no-image">
                      <span>📚</span>
                      <p>No Image</p>
                    </div>
                  )}

                  <div className="book-condition-badge">
                    {book.condition}
                  </div>

                </div>

                {/* Card Content */}
                <div className="book-card-content">

                  <div className="book-category">
                    {book.category || "General"}
                  </div>

                  <h2 className="book-title">
                    {book.title}
                  </h2>

                  <div className="book-details">

                    <p>
                      <span>Condition</span>

                      <strong>
                        {book.condition}
                      </strong>
                    </p>

                    <p>
                      <span>Seller</span>

                      <strong>
                        {book.seller_name ||
                          "Student Seller"}
                      </strong>
                    </p>

                    <p>
                      <span>Location</span>

                      <strong>
                        {book.location ||
                          "Not provided"}
                      </strong>
                    </p>

                  </div>

                  {/* Pricing */}
                  <div className="book-pricing">

                    <div className="seller-price-row">

                      <span>
                        Seller Price
                      </span>

                      <strong>
                        ₹{book.seller_price}
                      </strong>

                    </div>

                    <div className="fee-row">

                      <span>
                        Platform Fee
                      </span>

                      <strong>
                        ₹{book.platform_fee ?? "0.00"}
                      </strong>

                    </div>

                    <div className="buyer-price-row">

                      <span>
                        Buyer Price
                      </span>

                      <strong>
                        ₹
                        {book.buyer_price ??
                          book.seller_price}
                      </strong>

                    </div>

                  </div>

                  {/* Details Button */}
                  <Link
                    className="view-details-btn"
                    to={`/books/${book.id}`}
                  >
                    <span>View Details</span>

                    <span className="details-arrow">
                      ↗
                    </span>
                  </Link>

                </div>

              </article>

            ))}

          </section>

        </>

      )}

    </main>
  );
}

export default Books;