import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load books"
        );
        return;
      }

      setBooks(data.products || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Books error:",
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
    fetchBooks();
  }, []);

  const categories = [
    "All",
    ...new Set(
      books.map(
        (book) => book.category
      )
    ),
  ];

  const filteredBooks = books.filter(
    (book) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        book.title
          .toLowerCase()
          .includes(searchText) ||
        (book.description || "")
          .toLowerCase()
          .includes(searchText) ||
        (book.category || "")
          .toLowerCase()
          .includes(searchText) ||
        (book.seller_name || "")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        book.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  return (
    <div>
      <h1>Books</h1>

      <p>
        Browse approved used books
        available from student sellers.
      </p>

      {message && (
        <p>{message}</p>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search books..."
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

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>
      </div>

      <br />

      {loading ? (
        <p>
          Loading books...
        </p>
      ) : filteredBooks.length === 0 ? (
        <p>
          No approved books found.
        </p>
      ) : (
        <>
          <p>
            Showing{" "}
            <strong>
              {filteredBooks.length}
            </strong>{" "}
            books
          </p>

          <div className="books-grid">
            {filteredBooks.map(
              (book) => (
                <div
                  className="book-card"
                  key={book.id}
                >
                  <div className="book-image">
                    {book.image_url ? (
                      <img
                        src={book.image_url}
                        alt={book.title}
                      />
                    ) : (
                      <div>
                        No Image
                      </div>
                    )}
                  </div>

                  <h3>
                    {book.title}
                  </h3>

                  <p>
                    Category:{" "}
                    {book.category}
                  </p>

                  <p>
                    Condition:{" "}
                    {book.condition}
                  </p>

                  <p>
                    Seller:{" "}
                    {book.seller_name ||
                      "Student Seller"}
                  </p>

                  <p>
                    Seller Price:{" "}
                    <strong>
                      ₹
                      {book.seller_price}
                    </strong>
                  </p>

                  <p>
                    Platform Fee:{" "}
                    <strong>
                      ₹
                      {book.platform_fee ||
                        "0.00"}
                    </strong>
                  </p>

                  <p>
                    Buyer Price:{" "}
                    <strong>
                      ₹
                      {book.buyer_price ||
                        book.seller_price}
                    </strong>
                  </p>

                  <p>
                    Location:{" "}
                    {book.location ||
                      "Not provided"}
                  </p>

                  <Link
                    to={`/books/${book.id}`}
                  >
                    <button
                      type="button"
                    >
                      View Details
                    </button>
                  </Link>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Books;