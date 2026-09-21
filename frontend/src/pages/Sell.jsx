import { useState } from "react";
import "./Sell.css";

function Sell() {
  const [formData, setFormData] = useState({
    title: "",
    seller_price: "",
    category: "",
    condition: "",
    description: "",
    location: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            seller_price: Number(formData.seller_price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to list book");
        return;
      }

      setMessage(
        "Book submitted successfully and is waiting for admin approval."
      );

      setFormData({
        title: "",
        seller_price: "",
        category: "",
        condition: "",
        description: "",
        location: "",
      });
    } catch (error) {
      console.error("Sell book error:", error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <main className="sell-page">

      {/* Decorative Elements */}
      <div className="sell-decoration decoration-book-left">
        📚
      </div>

      <div className="sell-decoration decoration-book-right">
        📖
      </div>

      <div className="sell-decoration decoration-feather">
        🪶
      </div>

      <div className="sell-decoration decoration-compass">
        🧭
      </div>

      {/* Header */}
      <section className="sell-header">
        <h1>
          Sell Your Book
        </h1>

        <p>
          List your used book, notes, or study material for other students.
        </p>
      </section>

      {/* Form */}
      <form
        className="sell-form"
        onSubmit={handleSubmit}
      >

        {/* Title + Price */}
        <div className="form-row">

          <div className="form-field">
            <input
              type="text"
              name="title"
              placeholder="Book title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <input
              type="number"
              name="seller_price"
              placeholder="Seller price"
              min="0"
              value={formData.seller_price}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        {/* Category + Condition */}
        <div className="form-row">

          <div className="select-wrapper">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Category
              </option>

              <option value="Programming">
                Programming
              </option>

              <option value="Database">
                Database
              </option>

              <option value="Networking">
                Networking
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            <span className="select-icon">
              📚
            </span>
          </div>

          <div className="select-wrapper">
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Condition
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

            <span className="select-icon">
              ⭐
            </span>
          </div>

        </div>

        {/* Location */}
        <div className="form-field full-field">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-field description-field">
          <textarea
            name="description"
            placeholder="Book description"
            rows="7"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="list-book-btn"
        >
          <span>List Book</span>
          <span className="rocket-icon">🚀</span>
        </button>

      </form>

      {/* Message */}
      {message && (
        <p
          className={`sell-message ${
            message.includes("successfully")
              ? "success-message"
              : "error-message"
          }`}
        >
          {message}
        </p>
      )}

    </main>
  );
}

export default Sell;