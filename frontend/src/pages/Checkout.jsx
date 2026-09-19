import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const productId = location.state?.productId;

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
      setMessage(
        "No product selected for checkout."
      );
      return;
    }

    if (!address.trim()) {
      setMessage(
        "Delivery address is required."
      );
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
            product_id: productId,
            delivery_address:
              address.trim(),
            payment_method:
              paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to place order."
        );
        return;
      }

      setOrder(data.order || null);

      setMessage(
        "Order placed successfully."
      );

      setAddress("");
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!productId) {
    return (
      <div className="checkout">
        <h1>Checkout</h1>

        <p>
          No book was selected for checkout.
        </p>

        <Link to="/books">
          <button type="button">
            Browse Books
          </button>
        </Link>
      </div>
    );
  }

  if (order) {
    return (
      <div className="checkout">
        <h1>Order Confirmed</h1>

        <p>
          Your order has been placed
          successfully.
        </p>

        <hr />

        <p>
          Order ID:{" "}
          <strong>
            #{order.id}
          </strong>
        </p>

        <p>
          Seller Price:{" "}
          <strong>
            ₹{order.seller_price}
          </strong>
        </p>

        <p>
          Platform Fee:{" "}
          <strong>
            ₹{order.platform_fee}
          </strong>
        </p>

        <p>
          Buyer Price:{" "}
          <strong>
            ₹{order.buyer_price}
          </strong>
        </p>

        <p>
          Order Status:{" "}
          <strong>
            {order.status}
          </strong>
        </p>

        <p>
          Payment Method:{" "}
          <strong>
            {paymentMethod}
          </strong>
        </p>

        <br />

        <Link to="/orders">
          <button type="button">
            View My Orders
          </button>
        </Link>

        {" "}

        <Link to="/books">
          <button type="button">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1>Checkout</h1>

      <p>
        Complete your order for the
        selected book.
      </p>

      {message && (
        <p>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <h2>
          Delivery Address
        </h2>

        <textarea
          rows="5"
          placeholder="Enter your complete delivery address..."
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          required
        />

        <br />
        <br />

        <h2>
          Payment Method
        </h2>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(
              e.target.value
            )
          }
        >
          <option value="Cash on Delivery">
            Cash on Delivery
          </option>

          <option value="UPI">
            UPI
          </option>

          <option value="Card">
            Card
          </option>
        </select>

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Placing Order..."
            : "Place Order"}
        </button>
      </form>

      <br />

      <Link to="/books">
        Back to Books
      </Link>
    </div>
  );
}

export default Checkout;