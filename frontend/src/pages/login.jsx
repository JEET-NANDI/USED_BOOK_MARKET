import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const [animation, setAnimation] = useState({
    playerRunning: false,
    ballKicked: false,
    explosion: false,
    showLogin: false,
    hideBall: false,
    hideExplosion: false,
  });

  /* =========================================
     FOOTBALL ANIMATION
  ========================================= */

  useEffect(() => {
    const timers = [];

    // STEP 1 — Player starts running
    timers.push(
      setTimeout(() => {
        setAnimation((prev) => ({
          ...prev,
          playerRunning: true,
        }));
      }, 500)
    );

    // STEP 2 — Player reaches football and kicks
    timers.push(
      setTimeout(() => {
        setAnimation((prev) => ({
          ...prev,
          playerRunning: false,
          ballKicked: true,
        }));
      }, 2000)
    );

    // STEP 3 — Explosion
    timers.push(
      setTimeout(() => {
        setAnimation((prev) => ({
          ...prev,
          explosion: true,
        }));
      }, 2800)
    );

    // STEP 4 — Hide football and explosion
    timers.push(
      setTimeout(() => {
        setAnimation((prev) => ({
          ...prev,
          hideBall: true,
          hideExplosion: true,
        }));
      }, 3500)
    );

    // STEP 5 — Open login form
    timers.push(
      setTimeout(() => {
        setAnimation((prev) => ({
          ...prev,
          showLogin: true,
        }));
      }, 3600)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  /* =========================================
     FORM HANDLING
  ========================================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful!");

      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <main className="login-scene">

      {/* =====================================
          TITLE
      ===================================== */}

      <div
        className={`login-title ${
          animation.showLogin ? "title-hidden" : ""
        }`}
      >
        <h1>USED BOOK MARKET</h1>

        <p>
          Your next book is waiting for you
        </p>
      </div>

      {/* =====================================
          GROUND
      ===================================== */}

      <div className="football-ground"></div>

      {/* =====================================
          FOOTBALL PLAYER
      ===================================== */}

      <div
        className={`football-player ${
          animation.playerRunning ? "player-running" : ""
        }`}
      >

        {/* Head */}
        <div className="player-head">
          <div className="player-hair"></div>

          <div className="player-ear player-ear-left"></div>
          <div className="player-ear player-ear-right"></div>

          <div className="player-eye player-eye-left"></div>
          <div className="player-eye player-eye-right"></div>

          <div className="player-nose"></div>
          <div className="player-mouth"></div>
        </div>

        {/* Neck */}
        <div className="player-neck"></div>

        {/* Shirt */}
        <div className="player-body">
          <div className="player-collar"></div>
        </div>

        {/* Arms */}
        <div className="player-arm player-arm-left">
          <div className="player-hand"></div>
        </div>

        <div className="player-arm player-arm-right">
          <div className="player-hand"></div>
        </div>

        {/* Shorts */}
        <div className="player-pant player-pant-left"></div>
        <div className="player-pant player-pant-right"></div>

        {/* Legs */}
        <div className="player-leg player-leg-left">
          <div className="player-shoe"></div>
        </div>

        <div className="player-leg player-leg-right">
          <div className="player-shoe"></div>
        </div>
      </div>

      {/* =====================================
          FOOTBALL
      ===================================== */}

      {!animation.hideBall && (
        <div
          className={`login-football ${
            animation.ballKicked ? "football-kick" : ""
          }`}
        >
          ⚽
        </div>
      )}

      {/* =====================================
          EXPLOSION
      ===================================== */}

      {!animation.hideExplosion && (
        <div
          className={`football-explosion ${
            animation.explosion ? "explosion-show" : ""
          }`}
        >
          💥
        </div>
      )}

      {/* =====================================
          LOGIN BOX
      ===================================== */}

      <section
        className={`login-box ${
          animation.showLogin ? "login-box-show" : ""
        }`}
      >
        <div className="login-book-icon">
          📚
        </div>

        <h2>
          Welcome Back
        </h2>

        <p>
          Login to your account
        </p>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-input-group">
            <span>📧</span>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-input-group">
            <span>🔒</span>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Login
            <span>→</span>
          </button>
        </form>

        {message && (
          <p
            className={`login-message ${
              message.includes("successful")
                ? "login-success"
                : "login-error"
            }`}
          >
            {message}
          </p>
        )}

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;