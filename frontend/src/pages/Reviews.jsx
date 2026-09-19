import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

function Reviews() {
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("product");

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    if (!productId) {
      setMessage(
        "No book selected for reviews."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/reviews/product/${productId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load reviews."
        );
        return;
      }

      setReviews(data.reviews || []);
      setMessage("");
    } catch (error) {
      console.error(
        "Reviews error:",
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
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login to submit a review."
      );
      return;
    }

    if (!productId) {
      setMessage(
        "No book selected."
      );
      return;
    }

    if (!comment.trim()) {
      setMessage(
        "Please write a review comment."
      );
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: Number(productId),
            rating: Number(rating),
            comment: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to submit review."
        );
        return;
      }

      setMessage(
        "Review submitted successfully."
      );

      setRating("5");
      setComment("");

      await fetchReviews();
    } catch (error) {
      console.error(
        "Submit review error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!productId) {
    return (
      <div>
        <h1>Reviews</h1>

        <p>
          Select a book to view its
          reviews.
        </p>

        <Link to="/books">
          <button type="button">
            Browse Books
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Book Reviews</h1>

      <p>
        Product ID: #{productId}
      </p>

      {message && (
        <p>{message}</p>
      )}

      <hr />

      <h2>
        Write a Review
      </h2>

      {!localStorage.getItem("token") ? (
        <div>
          <p>
            Please login to write a
            review.
          </p>

          <Link to="/login">
            <button type="button">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Rating:{" "}

              <select
                value={rating}
                onChange={(e) =>
                  setRating(
                    e.target.value
                  )
                }
              >
                <option value="5">
                  5 - Excellent
                </option>

                <option value="4">
                  4 - Very Good
                </option>

                <option value="3">
                  3 - Good
                </option>

                <option value="2">
                  2 - Fair
                </option>

                <option value="1">
                  1 - Poor
                </option>
              </select>
            </label>
          </div>

          <br />

          <textarea
            rows="5"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            required
          />

          <br />
          <br />

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      )}

      <hr />

      <h2>
        Customer Reviews
      </h2>

      {loading ? (
        <p>
          Loading reviews...
        </p>
      ) : reviews.length === 0 ? (
        <p>
          No reviews yet.
        </p>
      ) : (
        <div>
          {reviews.map(
            (review) => (
              <div
                key={review.id}
              >
                <h3>
                  {review.user_name ||
                    "User"}
                </h3>

                <p>
                  Rating:{" "}
                  <strong>
                    {review.rating}/5
                  </strong>
                </p>

                <p>
                  {review.comment}
                </p>

                <p>
                  {new Date(
                    review.created_at
                  ).toLocaleString()}
                </p>

                <hr />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Reviews;