// src/pages/Bookings.jsx

import { useState, useEffect } from "react";
import api from "../api/axios";

function Bookings() {
  const [bookings, setBookings] = useState([]); // booking history
  const [pets, setPets] = useState([]);          // for the dropdown
  const [services, setServices] = useState([]);  // for the dropdown
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    pet: "",
    service: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // Fetch everything we need when the page loads
  const fetchData = async () => {
    try {
      const [bookingsRes, petsRes, servicesRes] = await Promise.all([
        api.get("/booking"),
        api.get("/pet"),
        api.get("/service"),
      ]);
      setBookings(bookingsRes.data);
      setPets(petsRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/booking", formData);
      setSuccess("Booking created successfully!");

      // Reset form
      setFormData({ pet: "", service: "", date: "", startTime: "", endTime: "" });

      // Refresh booking history
      fetchData();
    } catch (err) {
      // This is where our 409 conflict error message will show up!
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4" style={{ color: "#6f42c1" }}>📅 Bookings</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Create a New Booking</h5>

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Pet</label>
              <select
                className="form-select"
                name="pet"
                value={formData.pet}
                onChange={handleChange}
                required
              >
                <option value="">Select a pet</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Service</label>
              <select
                className="form-select"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} (₹{service.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: "#6f42c1" }}
              >
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>

      <h4 className="mb-3">My Booking History</h4>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Pet</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.pet?.name || "N/A"}</td>
                  <td>{booking.service?.name || "N/A"}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.startTime} - {booking.endTime}</td>
                  <td>
                    <span className={`badge bg-${
                      booking.status === "confirmed" ? "success" :
                      booking.status === "cancelled" ? "danger" :
                      booking.status === "completed" ? "secondary" : "warning"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <p className="text-center text-muted mt-3 mb-0">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  ); 
}

export default Bookings;