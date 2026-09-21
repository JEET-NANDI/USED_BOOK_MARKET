import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setAccountNotFound(false);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

         if (loginType === "admin") {
        setMessage(
          "Account is restricted. Only admin accounts can access this section."
        );
        
        setLoading(false);
        return;
      }

        setMessage(data.message || "Invalid email or password");

        if (
          response.status === 404 &&
          data.message === "Account not found. Please register first."
        ) {
          setAccountNotFound(true);
        }

        setLoading(false);
        return;
      }

      const user = data.user;

      if (!user) {
        setMessage("Invalid server response.");
        setLoading(false);
        return;
      }
      // ADMIN LOGIN
      if (loginType === "admin") {
        if (user?.role !== "admin") {
          setMessage(
            "Access denied. This account does not have admin permission."
          );
          setLoading(false);
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href =   
        `http://localhost:5174/?token=${encodeURIComponent(data.token)}`;
        return;
      }

      // USER LOGIN
      if (loginType === "user") {
        if (user?.role === "admin") {
          setMessage(
            "Please select ADMIN login for this account."
          );
          setLoading(false);
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to connect to server. Please start the backend."
      );
    }

    setLoading(false);
  };

  return (
    <div className="login-page">

      {/* Animated Background */}
      <div className="login-background">
        <span className="floating-book book-1">📕</span>
        <span className="floating-book book-2">📗</span>
        <span className="floating-book book-3">📘</span>
        <span className="floating-book book-4">📙</span>
        <span className="floating-book book-5">📚</span>
      </div>

      {/* Main Login Container */}
      <div className="login-container">

        {/* Left Side */}
        <div className="login-info">

          <div className="login-logo">
            📚
          </div>

          <h1>USED BOOK MARKET</h1>

          <p>
            Buy, Sell and Reuse Your Study Materials
          </p>

          <div className="login-flow">

            <div className="flow-box">
              <span className="flow-icon">👤</span>
              <strong>USER</strong>
              <small>Normal Login</small>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-box">
              <span className="flow-icon">👑</span>
              <strong>ADMIN</strong>
              <small>Restricted Login</small>
            </div>

          </div>

          <div className="login-info-footer">
            <span>📖</span>
            <span>Learn</span>

            <span>•</span>

            <span>💰</span>
            <span>Sell</span>

            <span>•</span>

            <span>♻️</span>
            <span>Reuse</span>
          </div>

        </div>

        {/* Right Side */}
        <div className="login-card">

          {/* Login Type */}
          <div className="login-type-selector">

            <button
              type="button"
              className={`login-type-button ${
                loginType === "user" ? "active-user" : ""
              }`}
              onClick={() => {
                setLoginType("user");
                setMessage("");
              }}
            >
              <span>👤</span>
              <span>USER</span>
            </button>

            <button
              type="button"
              className={`login-type-button ${
                loginType === "admin" ? "active-admin" : ""
              }`}
              onClick={() => {
                setLoginType("admin");
                setMessage("");
              }}
            >
              <span>👑</span>
              <span>ADMIN</span>
            </button>

          </div>

          {/* Heading */}
          <div className="login-card-header">

            <div className="login-card-icon">
              {loginType === "admin" ? "👑" : "👤"}
            </div>

            <h2>
              {loginType === "admin"
                ? "ADMIN LOGIN"
                : "USER LOGIN"}
            </h2>

            <p>
              {loginType === "admin"
                ? "Restricted administrator access"
                : "Login to your marketplace account"}
            </p>

          </div>

          {/* Admin Notice */}
          {loginType === "admin" && (
            <div className="admin-notice">
              <span>🔐</span>

              <div>
                <strong>Restricted Access</strong>
                <small>
                  Only authorized administrators can enter.
                </small>
              </div>
            </div>
          )}

          {/* Error / Message */}
          {message && (
            <div className="login-message">
              ⚠️ {message}
            </div>
          )}

          {accountNotFound && loginType === "user" && (
            <div className="account-not-found">
              <Link to="/register">
                Register Now →
              </Link>
            </div>
          )}

          {/* Login Form */}
          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            <div className="form-group">

              <label>Email Address</label>

              <div className="input-wrapper">
                <span>📧</span>

                <input
                  type="email"
                  placeholder={
                    loginType === "admin"
                      ? "Admin email"
                      : "Enter your email"
                  }
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

            </div>

            <div className="form-group">

              <label>Password</label>

              <div className="input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className={`login-submit ${
                loginType === "admin"
                  ? "admin-submit"
                  : ""
              }`}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Checking...
                </>
              ) : (
                <>
                  <span>
                    {loginType === "admin"
                      ? "👑"
                      : "🚀"}
                  </span>

                  {loginType === "admin"
                    ? "ADMIN LOGIN"
                    : "LOGIN"}
                </>
              )}

            </button>

          </form>

          {/* User Register */}
          {loginType === "user" && (
            <div className="register-section">

              <span>Don't have an account?</span>

              <Link to="/register">
                Create Account
              </Link>

            </div>
          )}

          {/* Admin Footer */}
          {loginType === "admin" && (
            <div className="admin-footer">
              🔐 Authorized administrators only
            </div>
          )}

          {/* Back */}
          <button
            type="button"
            className="back-home"
            onClick={() => navigate("/")}
          >
            ← Back to Marketplace
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;