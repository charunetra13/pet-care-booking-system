// src/pages/Pets.jsx

import { useState, useEffect } from "react";
// useEffect lets us run code automatically when the page loads (or when certain values change)
import api from "../api/axios";

function Pets() {
  const [pets, setPets] = useState([]); // stores the list of pets fetched from backend
  const [formData, setFormData] = useState({ name: "", species: "", breed: "", age: "" });
  const [editingId, setEditingId] = useState(null); // tracks if we're editing an existing pet (null = adding new)
  const [error, setError] = useState("");

  // Function to fetch all pets from backend
  const fetchPets = async () => {
    try {
      const response = await api.get("/pet");
      setPets(response.data); // update our state with the fetched pets, causing the page to re-render
    } catch (err) {
      setError("Failed to load pets");
    }
  };

  // useEffect with an empty array [] as the second argument means:
  // "run this function ONCE, right when the component first loads"
  useEffect(() => {
    fetchPets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // If we're editing, send a PUT request to update the existing pet
        await api.put(`/pet/${editingId}`, formData);
      } else {
        // Otherwise, create a brand new pet
        await api.post("/pet", formData);
      }

      // Reset the form and refresh the pet list
      setFormData({ name: "", species: "", breed: "", age: "" });
      setEditingId(null);
      fetchPets();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // When "Edit" is clicked on a pet card, fill the form with that pet's current data
  const handleEdit = (pet) => {
    setFormData({ name: pet.name, species: pet.species, breed: pet.breed || "", age: pet.age || "" });
    setEditingId(pet._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pet/${id}`);
      fetchPets(); // refresh the list after deleting
    } catch (err) {
      setError("Failed to delete pet");
    }
  };

    return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4" style={{ color: "#6f42c1" }}>🐾 My Pets</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h6 className="mb-3">{editingId ? "Edit Pet" : "Add a New Pet"}</h6>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Pet name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="species"
                placeholder="Species (Dog, Cat...)"
                value={formData.species}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="breed"
                placeholder="Breed (optional)"
                value={formData.breed}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-1">
              <button
                type="submit"
                className="btn w-100 text-white"
                style={{ backgroundColor: "#6f42c1" }}
              >
                {editingId ? "✓" : "+"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        {pets.map((pet) => (
          <div className="col-md-4 mb-3" key={pet._id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title">
                    {pet.species === "Dog" ? "🐶" : pet.species === "Cat" ? "🐱" : "🐾"} {pet.name}
                  </h5>
                </div>
                <p className="card-text text-muted mb-1">
                  {pet.species} {pet.breed && `- ${pet.breed}`}
                </p>
                <p className="card-text text-muted">Age: {pet.age || "N/A"}</p>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => handleEdit(pet)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(pet._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center text-muted mt-5">
          <div style={{ fontSize: "3rem" }}>🐾</div>
          <p>No pets added yet. Add your first pet above!</p>
        </div>
      )}
    </div>
  );
}

export default Pets;