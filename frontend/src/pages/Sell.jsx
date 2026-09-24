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
  const [formData, setFormData] =
    useState(initialFormData);

  const [bookImage, setBookImage] =
    useState(null);

  const [imageError, setImageError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setImageError("");
    setMessage("");

    if (!file) {
      setBookImage(null);
      return;
    }

    // Maximum image size = 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setBookImage(null);

      setImageError(
        "Image size must be 5 MB or less."
      );

      // Clear selected file
      e.target.value = "";

      return;
    }

    setBookImage(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");
      return;
    }

    // Check image
    if (!bookImage) {
      setImageError(
        "Please upload a picture of the book."
      );
      return;
    }

    setImageError("");
    setIsSubmitting(true);

    try {
      const formDataToSend =
        new FormData();

      formDataToSend.append(
        "title",
        formData.title
      );

      formDataToSend.append(
        "seller_price",
        Number(formData.seller_price)
      );

      formDataToSend.append(
        "category",
        formData.category
      );

      formDataToSend.append(
        "condition",
        formData.condition
      );

      formDataToSend.append(
        "description",
        formData.description
      );

      formDataToSend.append(
        "location",
        formData.location
      );

      formDataToSend.append(
        "bookImage",
        bookImage
      );


      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formDataToSend,
        }
      );


      const data =
        await response.json();


      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to create listing"
        );

        return;
      }


      setMessage(
        "Book listing submitted successfully."
      );

      // Reset form
      setFormData(initialFormData);

      setBookImage(null);

      setImageError("");


      // Clear file input
      const fileInput =
        document.getElementById(
          "book-image"
        );

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.error(
        "Sell book error:",
        error
      );

      setMessage(
        "Unable to connect to server"
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="sell-page">

      <div className="sell-glow sell-glow-one"></div>

      <div className="sell-glow sell-glow-two"></div>


      <div className="sell-content">

        <div className="sell-header">

          <span className="sell-kicker">
            LIST YOUR BOOK
          </span>

          <h1>
            Sell Your <span>Book</span>
          </h1>

          <p>
            Give your old book a second life.
          </p>

        </div>


        <form
          className="sell-form"
          onSubmit={handleSubmit}
        >

          {/* BOOK TITLE + PRICE */}

          <div className="form-row">

            <div className="form-field">

              <label htmlFor="title">
                Book Title
              </label>

              <input
                id="title"
                type="text"
                name="title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-field">

              <label htmlFor="seller_price">
                Seller Price
              </label>

              <input
                id="seller_price"
                type="number"
                name="seller_price"
                placeholder="Enter price"
                min="1"
                value={
                  formData.seller_price
                }
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* CATEGORY + CONDITION */}

          <div className="form-row">

            <div className="form-field">

              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select category
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

                <option value="Operating System">
                  Operating System
                </option>

                <option value="Computer Science">
                  Computer Science
                </option>

                <option value="Mathematics">
                  Mathematics
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            <div className="form-field">

              <label htmlFor="condition">
                Condition
              </label>

              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
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

                <option value="Fair">
                  Fair
                </option>

                <option value="Used">
                  Used
                </option>

              </select>

            </div>

          </div>


          {/* BOOK PICTURE */}

          <div className="form-field image-upload-field">

            <label htmlFor="book-image">
              Book Picture
            </label>

            <input
              id="book-image"
              type="file"
              name="bookImage"
              accept="image/*"
              onChange={handleImageChange}
              required
            />


            {bookImage && (
              <p className="selected-image-name">
                Selected: {bookImage.name}
              </p>
            )}


            {imageError && (
              <p
                className="image-error"
                role="alert"
              >
                {imageError}
              </p>
            )}

          </div>


          {/* LOCATION */}

          <div className="form-field">

            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              type="text"
              name="location"
              placeholder="Enter your location"
              value={formData.location}
              onChange={handleChange}
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-field">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Describe your book..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          {/* MESSAGE */}

          {message && (
            <p className="sell-message">
              {message}
            </p>
          )}


          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            className="list-book-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Listing"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Sell;