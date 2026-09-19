import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        setMessage(data.message);
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
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>

      <p>
        Login to your account to buy and sell books.
      </p>

      <form
        className="login-form"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>
      </form>

      {message && (
        <p className="login-message">
          {message}
        </p>
      )}

      <p className="register-link">
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;