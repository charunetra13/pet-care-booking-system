// src/pages/Home.jsx

import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      {/* Hero section - a large, eye-catching banner at the top */}
      <div
        className="text-center text-white d-flex flex-column justify-content-center align-items-center"
        style={{
          background: "linear-gradient(135deg, #6f42c1, #fd7e14)", // purple-to-orange gradient
          minHeight: "70vh", // takes up most of the visible screen height
        }}
      >
        <h1 className="display-3 fw-bold">🐾 Pet Care Booking System</h1>
        <p className="lead mb-4">Book trusted care for your furry friends, anytime, anywhere.</p>

        {/* Show different buttons depending on login state */}
        {user ? (
          <Link to="/pets" className="btn btn-light btn-lg">
            Go to My Pets
          </Link>
        ) : (
          <Link to="/register" className="btn btn-light btn-lg">
            Get Started
          </Link>
        )}
      </div>

      {/* Feature highlights section */}
      <div className="container mt-5 mb-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div style={{ fontSize: "2.5rem" }}>🐶</div>
                <h5 className="card-title mt-3">Manage Your Pets</h5>
                <p className="card-text text-muted">
                  Keep track of all your pets' details in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div style={{ fontSize: "2.5rem" }}>🧴</div>
                <h5 className="card-title mt-3">Browse Services</h5>
                <p className="card-text text-muted">
                  Find trusted grooming, sitting, and walking services near you.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div style={{ fontSize: "2.5rem" }}>📅</div>
                <h5 className="card-title mt-3">Easy Booking</h5>
                <p className="card-text text-muted">
                  Book appointments with zero double-booking hassles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;