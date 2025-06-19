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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password, role } = form;

    if (!name || !email || !password || !role) {
      return "All fields are required.";
    }

    const nameValid = /^[A-Za-z ]+$/.test(form.name);
    const emailValid = /^[\w.-]+@gmail\.com$/.test(form.email);
    const passwordValid = /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(form.password);

    if (!nameValid) return "Name must only contain letters.";
    if (!emailValid) return "Email must be a valid Gmail address.";
    if (!passwordValid) return "Password must be 6+ chars with 1 capital & 1 number.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    try {
      const res = await axios.get("http://localhost:3000/users");
      const duplicate = res.data.find((u) => u.email === form.email);

      if (duplicate) {
        return setError("Email already registered.");
      }

      await axios.post("http://localhost:3000/users", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2 className="text-center">Registration</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="email"
          placeholder="Email (@gmail.com)"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <select
          className="form-control mb-3"
          name="role"
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="employer">Employer</option>
          <option value="jobseeker">Jobseeker</option>
        </select>
        <button className="btn btn-success w-100">Register</button>
      </form><br />
      <div className="text-center">
        <label className="form-label">Already have an account?</label>
        <Link to="/login" className="btn btn-outline-success w-100 mb-3">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Register;
