import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!productId) {
      setMessage("No product selected for checkout.");
      return;
    }

    if (!address.trim()) {
      setMessage("Delivery address is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: Number(productId),
            delivery_address: address.trim(),
            payment_method: paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to place order."
        );
        return;
      }

      setOrder(data.order || null);

      setMessage("Order placed successfully.");

      setAddress("");
    } catch (error) {
      console.error("Checkout error:", error);

      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     NO PRODUCT
  ============================== */

  if (!productId) {
    return (
      <main className="checkout-page">
        <div className="checkout-error-card">
          <div className="checkout-error-icon">
            📕
          </div>

          <h1>Checkout</h1>

          <p>
            No book was selected for checkout.
          </p>

          <Link to="/books">
            <button
              type="button"
              className="checkout-primary-button"
            >
              📚 Browse Books
            </button>
          </Link>
        </div>
      </main>
    );
  }

  /* ==============================
     ORDER SUCCESS
  ============================== */

  if (order) {
    return (
      <main className="checkout-page">

        <div className="checkout-success-card">

          <div className="success-animation">
            <div className="success-circle">
              ✓
            </div>
          </div>

          <p className="checkout-label">
            ORDER COMPLETED
          </p>

          <h1>
            Order <span>Confirmed!</span>
          </h1>

          <p className="success-text">
            Your book order has been placed
            successfully.
          </p>

          <div className="success-divider"></div>

          <div className="order-details-box">

            <div className="order-detail-row">
              <span>Order ID</span>
              <strong>
                #{order.id}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>Seller Price</span>
              <strong>
                ₹{order.seller_price}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>Platform Fee</span>
              <strong className="fee-text">
                ₹{order.platform_fee}
              </strong>
            </div>

            <div className="order-detail-row total-row">
              <span>Buyer Price</span>
              <strong>
                ₹{order.buyer_price}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>Order Status</span>
              <strong className="status-text">
                {order.status}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>Payment Method</span>
              <strong>
                {paymentMethod}
              </strong>
            </div>

          </div>

          <div className="success-actions">

            <Link to="/orders">
              <button
                type="button"
                className="checkout-primary-button"
              >
                📦 View My Orders
              </button>
            </Link>

            <Link to="/books">
              <button
                type="button"
                className="checkout-secondary-button"
              >
                📚 Continue Shopping
              </button>
            </Link>

          </div>

        </div>

      </main>
    );
  }

  /* ==============================
     CHECKOUT PAGE
  ============================== */

  return (
    <main className="checkout-page">

      <div className="checkout-bg-circle checkout-circle-one"></div>
      <div className="checkout-bg-circle checkout-circle-two"></div>

      <div className="checkout-floating-book checkout-book-one">
        📘
      </div>

      <div className="checkout-floating-book checkout-book-two">
        📚
      </div>

      <div className="checkout-floating-book checkout-book-three">
        📖
      </div>

      {/* HEADER */}

      <section className="checkout-header">

        <p className="checkout-label">
          STUDENT BOOK MARKETPLACE
        </p>

        <h1>
          Secure <span>Checkout</span>
        </h1>

        <p>
          Complete your delivery and payment
          details to place your order.
        </p>

        <div className="checkout-header-line"></div>

      </section>

      {/* STEPS */}

      <div className="checkout-steps">

        <div className="checkout-step active">
          <span>1</span>
          <p>Checkout</p>
        </div>

        <div className="step-line"></div>

        <div className="checkout-step">
          <span>2</span>
          <p>Payment</p>
        </div>

        <div className="step-line"></div>

        <div className="checkout-step">
          <span>3</span>
          <p>Confirmation</p>
        </div>

      </div>

      {/* MAIN */}

      <section className="checkout-container">

        {/* LEFT */}

        <div className="checkout-form-card">

          <div className="card-heading">
            <div className="heading-icon">
              📦
            </div>

            <div>
              <h2>Delivery Details</h2>

              <p>
                Where should we deliver your book?
              </p>
            </div>
          </div>

          {message && (
            <div className="checkout-message">
              ⚠️ {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label htmlFor="address">
              Delivery Address
            </label>

            <textarea
              id="address"
              rows="6"
              placeholder="Enter your complete delivery address..."
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              required
            />

            <div className="address-hint">
              📍 Please provide a complete address
              including city and PIN code.
            </div>

            <label htmlFor="payment">
              Payment Method
            </label>

            <div className="payment-options">

              <label
                className={
                  paymentMethod === "Cash on Delivery"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span className="payment-icon">
                  💵
                </span>

                <span>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when your book arrives
                  </small>
                </span>
              </label>

              <label
                className={
                  paymentMethod === "UPI"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={
                    paymentMethod === "UPI"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span className="payment-icon">
                  📱
                </span>

                <span>
                  <strong>UPI</strong>

                  <small>
                    Pay using UPI
                  </small>
                </span>
              </label>

              <label
                className={
                  paymentMethod === "Card"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={
                    paymentMethod === "Card"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span className="payment-icon">
                  💳
                </span>

                <span>
                  <strong>Card</strong>

                  <small>
                    Pay using debit or credit card
                  </small>
                </span>
              </label>

            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Placing Order...
                </>
              ) : (
                <>
                  🛒 Place Order
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <Link
            to={`/books/${productId}`}
            className="back-product-link"
          >
            ← Back to Book
          </Link>

        </div>

        {/* RIGHT */}

        <aside className="checkout-summary-card">

          <div className="summary-top">
            <span>📚</span>

            <div>
              <small>ORDER SUMMARY</small>
              <h2>Your Book</h2>
            </div>
          </div>

          <div className="summary-book">

            <div className="summary-book-icon">
              📖
            </div>

            <div>
              <strong>
                Selected Book
              </strong>

              <p>
                Product ID #{productId}
              </p>
            </div>

          </div>

          <div className="summary-divider"></div>

          <div className="summary-info">

            <div>
              <span>Product</span>
              <strong>
                Book #{productId}
              </strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>
                {paymentMethod}
              </strong>
            </div>

          </div>

          <div className="secure-box">
            <span>🔒</span>

            <div>
              <strong>Secure Checkout</strong>

              <p>
                Your order information is
                securely sent to our server.
              </p>
            </div>
          </div>

        </aside>

      </section>

    </main>
  );
}

export default Checkout;