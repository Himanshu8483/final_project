import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate input fields
  const validateForm = () => {
    const { name, email, password, role } = form;
    if (!name || !email || !password || !role) {
      return "All fields are required.";
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
      return "Name must only contain letters.";
    }

    if (!/^[\w.-]+@gmail\.com$/.test(email)) {
      return "Email must be a valid Gmail address.";
    }

    if (!/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)) {
      return "Password must be 6+ chars with 1 capital & 1 number.";
    }

    return null;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    try {
      // Check for duplicate email
      const res = await axios.get("http://localhost:8000/users/");
      const exists = res.data.find((u) => u.email === form.email);
      if (exists) return setError("Email already registered.");

      // Register new user
      await axios.post("http://localhost:8000/users/", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-3">📝 Register</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            name="email"
            placeholder="Email (Gmail only)"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <select
            className="form-control mb-3"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="employer">Employer</option>
            <option value="jobseeker">Jobseeker</option>
          </select>

          <button className="btn btn-success w-100">Register</button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-1">Already have an account?</p>
          <Link to="/login" className="btn btn-outline-primary w-100">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
