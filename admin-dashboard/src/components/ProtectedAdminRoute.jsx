import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      // Get token sent from main frontend
      const params = new URLSearchParams(window.location.search);
      const queryToken = params.get("token");

      if (queryToken) {
        // Save token for admin dashboard
        localStorage.setItem("token", queryToken);

        // Decode JWT payload
        const payload = JSON.parse(
          atob(
            queryToken
              .split(".")[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );

        // Save admin user information
        localStorage.setItem(
          "user",
          JSON.stringify(payload)
        );

        // Remove token from browser URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }

      const token = localStorage.getItem("token");
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (token && user && user.role === "admin") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    } catch (error) {
      console.error("Admin authentication error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setAllowed(false);
    }

    setChecking(false);
  }, []);

  if (checking) {
    return <div>Checking admin access...</div>;
  }

  if (!allowed) {
    window.location.href = "http://localhost:5173/login";
    return null;
  }

  return children;
}

export default ProtectedAdminRoute;