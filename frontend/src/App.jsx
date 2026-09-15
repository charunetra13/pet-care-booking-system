// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // NEW import
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pets from "./pages/Pets";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* NEW - placed OUTSIDE Routes, so it shows on EVERY page */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;