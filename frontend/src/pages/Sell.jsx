import { useState } from "react";
import "./Sell.css";

const initialFormData = {
  title: "",
  seller_price: "",
  category: "",
  condition: "",
  description: "",
  location: "",
};

function Sell() {
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          seller_price: Number(formData.seller_price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to list your book.");
        return;
      }

      setMessage(
        "Book submitted successfully and is waiting for admin approval."
      );
      setFormData(initialFormData);
    } catch (error) {
      console.error("Sell book error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSuccess = message.includes("successfully");

  return (
    <main className="sell-page">
      <div className="sell-glow sell-glow-one" aria-hidden="true" />
      <div className="sell-glow sell-glow-two" aria-hidden="true" />

      <span
        className="sell-decoration decoration-book-left"
        aria-hidden="true"
      >
        📚
      </span>

      <span
        className="sell-decoration decoration-book-right"
        aria-hidden="true"
      >
        📖
      </span>

      <span
        className="sell-decoration decoration-feather"
        aria-hidden="true"
      >
        🪶
      </span>

      <span
        className="sell-decoration decoration-compass"
        aria-hidden="true"
      >
        🧭
      </span>

      <section className="sell-content">
        <header className="sell-header">
          <span className="sell-kicker">Give your books a new chapter</span>

          <h1>
            Sell Your <span>Book</span>
          </h1>

          <p>
            List your used books, notes, or study materials for other students.
          </p>
        </header>

        <form className="sell-form" onSubmit={handleSubmit}>
          <div className="sell-form-heading">
            <div>
              <h2>Book details</h2>
              <p>Fill in the details to create your listing.</p>
            </div>

            <span className="sell-form-icon" aria-hidden="true">
              ✨
            </span>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="book-title">Book title</label>
              <input
                id="book-title"
                type="text"
                name="title"
                placeholder="e.g. Introduction to Algorithms"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="seller-price">Your price</label>

              <div className="price-input-wrap">
                <span aria-hidden="true">₹</span>
                <input
                  id="seller-price"
                  type="number"
                  name="seller_price"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  value={formData.seller_price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="book-category">Category</label>
              <select
                id="book-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Choose a category
                </option>
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="Networking">Networking</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="book-condition">Condition</label>
              <select
                id="book-condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Choose condition
                </option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="book-location">Location</label>
            <input
              id="book-location"
              type="text"
              name="location"
              placeholder="City, campus, or area"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="book-description">
              Description <span className="optional-label">Optional</span>
            </label>
            <textarea
              id="book-description"
              name="description"
              placeholder="Share details about the book, edition, or any notes..."
              rows={5}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="list-book-btn"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? "Submitting..." : "List my book"}</span>
            <span className="rocket-icon" aria-hidden="true">
              {isSubmitting ? "⏳" : "🚀"}
            </span>
          </button>

          <p className="sell-footnote">
            Your listing will be reviewed before it appears to other students.
          </p>
        </form>

        {message && (
          <p
            className={`sell-message ${
              isSuccess ? "success-message" : "error-message"
            }`}
            role="status"
          >
            <span aria-hidden="true">{isSuccess ? "✓" : "!"}</span>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}

export default Sell;