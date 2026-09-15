// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import api from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };

    fetchStats();
  }, []);

  // Reusable little component for a single stat card
  const StatCard = ({ icon, label, value, color }) => (
    <div className="col-md-3 mb-3">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body text-center">
          <div style={{ fontSize: "2rem" }}>{icon}</div>
          <h3 className="mt-2 mb-0" style={{ color }}>{value}</h3>
          <p className="text-muted mb-0">{label}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4" style={{ color: "#6f42c1" }}>📊 Admin Dashboard</h2>

      {/* Only Admins should actually be able to fetch this - show a friendly message for everyone else */}
      {error && (
        <div className="alert alert-warning">
          {error === "You do not have permission to do this"
            ? "This dashboard is only available to Admin accounts."
            : error}
        </div>
      )}

      {stats && (
        <>
          <h5 className="text-muted mb-3">Users</h5>
          <div className="row">
            <StatCard icon="👥" label="Total Users" value={stats.users.total} color="#6f42c1" />
            <StatCard icon="🐕" label="Pet Owners" value={stats.users.petOwners} color="#fd7e14" />
            <StatCard icon="🧑‍⚕️" label="Care Providers" value={stats.users.careProviders} color="#20c997" />
          </div>

          <h5 className="text-muted mb-3 mt-4">Pets & Services</h5>
          <div className="row">
            <StatCard icon="🐾" label="Total Pets" value={stats.pets.total} color="#6f42c1" />
            <StatCard icon="🧴" label="Total Services" value={stats.services.total} color="#fd7e14" />
          </div>

          <h5 className="text-muted mb-3 mt-4">Bookings</h5>
          <div className="row">
            <StatCard icon="📅" label="Total Bookings" value={stats.bookings.total} color="#6f42c1" />
            <StatCard icon="⏳" label="Pending" value={stats.bookings.pending} color="#ffc107" />
            <StatCard icon="✅" label="Confirmed" value={stats.bookings.confirmed} color="#198754" />
            <StatCard icon="🚫" label="Cancelled" value={stats.bookings.cancelled} color="#dc3545" />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;