import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Listings.css";

function Listings() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/products/my",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message);
          return;
        }

        setListings(data.products);
      } catch (error) {
        console.error("Fetch listings error:", error);
        setMessage("Unable to connect to server");
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="listings-page">
      <h1>My Listings</h1>

      <p>Manage the books you are selling.</p>

      <Link className="add-listing" to="/sell">
        + Add New Book
      </Link>

      {message && <p>{message}</p>}

      {listings.length > 0 ? (
        <div className="listings-list">
          {listings.map((listing) => (
            <div className="listing-card" key={listing.id}>

              {/* BOOK IMAGE */}
              {listing.image_url ? (
                <img
                  src={`http://localhost:5000${listing.image_url}`}
                  alt={listing.title}
                  className="listing-image"
                />
              ) : (
                <div className="listing-image-placeholder">
                  No Image
                </div>
              )}

              <h2>{listing.title}</h2>

              <p>
                <strong>Category:</strong>{" "}
                {listing.category}
              </p>

              <p>
                <strong>Condition:</strong>{" "}
                {listing.condition}
              </p>

              <p>
                <strong>Seller Price:</strong>{" "}
                ₹{Number(listing.seller_price).toFixed(2)}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {listing.location}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="listing-status">
                  {listing.status}
                </span>
              </p>

            </div>
          ))}
        </div>
      ) : (
        !message && <p>You have no listings yet.</p>
      )}

      <Link
        className="back-dashboard"
        to="/dashboard"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default Listings;