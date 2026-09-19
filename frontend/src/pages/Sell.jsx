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
        setMessage(data.message);
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
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="sell-page">
      <h1>Sell Your Book</h1>

      <p>
        List your used book, notes, or study material
        for other students.
      </p>

      <form
        className="sell-form"
        onSubmit={handleSubmit}
      >
        <div className="form-row">
          <input
            type="text"
            name="title"
            placeholder="Book title"
            value={formData.title}
            onChange={handleChange}
            required
          />

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

        <div className="form-row">
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
        </div>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Book description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <button type="submit">
          List Book
        </button>
      </form>

      {message && (
        <p className="sell-message">
          {message}
        </p>
      )}
    </div>
  );
}

export default Sell;