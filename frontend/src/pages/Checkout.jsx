import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Checkout.css";

const PAYMENT_METHODS = [
  {
    value: "Cash on Delivery",
    icon: "💵",
    title: "Cash on Delivery",
    desc: "Pay in cash when your book arrives",
  },
  {
    value: "UPI",
    icon: "📱",
    title: "UPI",
    desc: "Pay using UPI",
  },
  {
    value: "Card",
    icon: "💳",
    title: "Card",
    desc: "Pay using debit or credit card",
  },
];

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
};

function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [placedAddress, setPlacedAddress] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      nextErrors.fullName = "Full name is required (min 3 letters).";
    }

    const phoneDigits = form.phone.replace(/\D/g, "").slice(-10);
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      nextErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!form.pincode.trim()) {
      nextErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      nextErrors.pincode = "Enter a valid 6-digit pincode.";
    }

    if (!form.locality.trim()) {
      nextErrors.locality = "Locality is required.";
    }

    if (!form.address.trim() || form.address.trim().length < 10) {
      nextErrors.address = "Full address is required (min 10 characters).";
    }

    if (!form.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!form.state.trim()) {
      nextErrors.state = "State is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildDeliveryAddress = () => {
    const parts = [
      form.fullName.trim(),
      form.address.trim(),
      form.locality.trim(),
      `${form.city.trim()}, ${form.state.trim()} - ${form.pincode.trim()}`,
      `Phone: ${form.phone.trim()}`,
    ];
    if (form.landmark.trim()) {
      parts.push(`Landmark: ${form.landmark.trim()}`);
    }
    return parts.join(", ");
  };

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

    if (!validateForm()) {
      setMessage("Please fill all required delivery details correctly.");
      return;
    }

    // User confirms the order like Flipkart before placing
    const confirmed = window.confirm(
      `Place order with ${paymentMethod}?\n\nDeliver to: ${form.fullName}, ${form.city} - ${form.pincode}`
    );
    if (!confirmed) return;

    try {
      setLoading(true);

      const deliveryAddress = buildDeliveryAddress();

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
            delivery_address: deliveryAddress,
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
      setPlacedAddress({
        ...form,
        fullText: deliveryAddress,
        paymentMethod,
      });
      setMessage("Order placed successfully.");
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
     ORDER SUCCESS - YOUR ORDER SECTION
  ============================== */

  if (order) {
    const isCOD = (placedAddress?.paymentMethod || paymentMethod) === "Cash on Delivery";
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
            Your Order <span>Confirmed!</span>
          </h1>

          <p className="success-text">
            {isCOD
              ? "Your Cash on Delivery order is placed. Keep the amount ready when your book arrives."
              : "Your book order has been placed successfully."}
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
              <span>{isCOD ? "Pay on Delivery" : "Buyer Price"}</span>
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
                {placedAddress?.paymentMethod || paymentMethod}
                {isCOD ? " 💵" : ""}
              </strong>
            </div>

            {placedAddress && (
              <>
                <div className="order-detail-row">
                  <span>Deliver To</span>
                  <strong>
                    {placedAddress.fullName}
                  </strong>
                </div>
                <div className="order-detail-row">
                  <span>Phone</span>
                  <strong>
                    {placedAddress.phone}
                  </strong>
                </div>
                <div className="order-detail-row address-row">
                  <span>Address</span>
                  <strong>
                    {placedAddress.fullText}
                  </strong>
                </div>
              </>
            )}

          </div>

          {isCOD && (
            <div className="cod-note">
              💵 <strong>Cash on Delivery:</strong> please keep
              {" "}₹{order.buyer_price} ready. Pay only when you receive the book.
            </div>
          )}

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
     CHECKOUT PAGE - FLIPKART STYLE
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
          Add delivery address like Flipkart, choose payment,
          then place your Cash on Delivery order.
        </p>

        <div className="checkout-header-line"></div>

      </section>

      {/* STEPS */}

      <div className="checkout-steps">

        <div className="checkout-step active">
          <span>1</span>
          <p>Address</p>
        </div>

        <div className="step-line"></div>

        <div className="checkout-step active">
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
                All fields with * are required, like Flipkart.
              </p>
            </div>
          </div>

          {message && (
            <div className="checkout-message">
              ⚠️ {message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="delivery-grid">
              <div className="field">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                {errors.fullName && <small className="field-error">{errors.fullName}</small>}
              </div>

              <div className="field">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength="13"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && <small className="field-error">{errors.phone}</small>}
              </div>

              <div className="field">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="e.g. 700001"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
                {errors.pincode && <small className="field-error">{errors.pincode}</small>}
              </div>

              <div className="field">
                <label htmlFor="locality">Locality *</label>
                <input
                  id="locality"
                  name="locality"
                  type="text"
                  placeholder="Area, street, sector"
                  value={form.locality}
                  onChange={handleChange}
                  required
                />
                {errors.locality && <small className="field-error">{errors.locality}</small>}
              </div>
            </div>

            <label htmlFor="address">
              Full Address (House No, Building, Street) *
            </label>

            <textarea
              id="address"
              name="address"
              rows="4"
              placeholder="Flat / House no, building, street..."
              value={form.address}
              onChange={handleChange}
              required
            />
            {errors.address && <small className="field-error">{errors.address}</small>}

            <div className="delivery-grid">
              <div className="field">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="e.g. Kolkata"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && <small className="field-error">{errors.city}</small>}
              </div>

              <div className="field">
                <label htmlFor="state">State *</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="e.g. West Bengal"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
                {errors.state && <small className="field-error">{errors.state}</small>}
              </div>
            </div>

            <label htmlFor="landmark">
              Landmark (Optional)
            </label>

            <input
              id="landmark"
              name="landmark"
              type="text"
              placeholder="Near school, temple, shop..."
              value={form.landmark}
              onChange={handleChange}
              className="landmark-input"
            />

            <div className="address-hint">
              📍 Please provide a complete address
              including city and PIN code.
            </div>

            <label>
              Payment Method *
            </label>

            <div className="payment-options">
              {PAYMENT_METHODS.map((option) => (
                <label
                  key={option.value}
                  className={
                    paymentMethod === option.value
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <span className="payment-icon">
                    {option.icon}
                  </span>

                  <span>
                    <strong>
                      {option.title}
                    </strong>

                    <small>
                      {option.desc}
                    </small>
                  </span>
                </label>
              ))}
            </div>

            {paymentMethod === "Cash on Delivery" && (
              <div className="cod-note">
                💵 <strong>Cash on Delivery selected:</strong> pay in
                cash when the book is delivered to your address.
              </div>
            )}

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
              <span>Deliver To</span>
              <strong>
                {form.fullName || "-"}, {form.city || "-"} {form.pincode || ""}
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
                Your order goes to My Orders for you and to
                Admin Order Management for processing.
              </p>
            </div>
          </div>

        </aside>

      </section>

    </main>
  );
}

export default Checkout;
