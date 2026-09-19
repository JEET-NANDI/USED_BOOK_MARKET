import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
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

        setUser(data.user);
      } catch (error) {
        setMessage("Unable to connect to server");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {message && <p>{message}</p>}

      {user && (
        <div className="profile-info">
          <h2>{user.name}</h2>

          <p>Email: {user.email}</p>

          <p>Role: {user.role}</p>

          <p>User ID: {user.id}</p>
        </div>
      )}

      <div className="profile-menu">
        <Link to="/orders">My Orders</Link>

        <Link to="/listings">My Listings</Link>

        <Link to="/wishlist">My Wishlist</Link>

        <Link to="/sell">Sell a Book</Link>

        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}

export default Profile;