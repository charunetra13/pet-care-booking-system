// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Check if a user is currently logged in by checking localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Remove both the token and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Send them back to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4 py-3" style={{ background: "linear-gradient(90deg, #6f42c1, #8540f5)" }}>
      <Link className="navbar-brand" to="/">
        🐾 PetCare
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/pets">My Pets</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/services">Services</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/bookings">Bookings</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <ul className="navbar-nav">
          {/* Show different links depending on whether the user is logged in */}
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link text-white-50">Hi, {user.name}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm mt-1" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;