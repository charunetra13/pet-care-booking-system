// src/pages/Services.jsx

import { useState, useEffect } from "react";
import api from "../api/axios";

function Services() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Get the logged-in user's info from localStorage (saved during login)
  // JSON.parse converts the stored TEXT back into a real JavaScript object
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if this user is allowed to manage services
  const canManageServices = user && (user.role === "careProvider" || user.role === "admin");

  const fetchServices = async () => {
    try {
      const response = await api.get("/service");
      setServices(response.data);
    } catch (err) {
      setError("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.put(`/service/${editingId}`, formData);
      } else {
        await api.post("/service", formData);
      }

      setFormData({ name: "", description: "", price: "" });
      setEditingId(null);
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (service) => {
    setFormData({ name: service.name, description: service.description || "", price: service.price });
    setEditingId(service._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/service/${id}`);
      fetchServices();
    } catch (err) {
      setError("Failed to delete service");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4" style={{ color: "#6f42c1" }}>🧴 Services</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {canManageServices && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h6 className="mb-3">{editingId ? "Edit Service" : "Offer a New Service"}</h6>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Service name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  placeholder="Price (₹)"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <button
                  type="submit"
                  className="btn w-100 text-white"
                  style={{ backgroundColor: "#6f42c1" }}
                >
                  {editingId ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {services.map((service) => (
          <div className="col-md-4 mb-3" key={service._id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">🧴 {service.name}</h5>
                <p className="card-text text-muted">{service.description}</p>
                <p className="card-text fw-bold" style={{ color: "#6f42c1" }}>
                  ₹{service.price}
                </p>
                <p className="card-text">
                  <small className="text-muted">By: {service.provider?.name || "Unknown"}</small>
                </p>

                {canManageServices && service.provider?._id === user.id && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(service._id)}
                    >
                      Delete
                    </button>
                  </>
                )}

                {!canManageServices && (
                  <button
                    className="btn btn-sm text-white"
                    style={{ backgroundColor: "#fd7e14" }}
                  >
                    Book This
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center text-muted mt-5">
          <div style={{ fontSize: "3rem" }}>🧴</div>
          <p>No services available yet.</p>
        </div>
      )}
    </div>
  );
}

export default Services;