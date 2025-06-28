import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Easily change API base URL
// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://himanshukush.pythonanywhere.com"; 
// const API_BASE_URL = "http://localhost:3000"; 



function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const adminUser = {
    email: "admin@gmail.com",
    password: "Admin@123",
    role: "admin",
    name: "Admin User"
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      return setError("Both fields are required.");
    }

    let user = null;

    // Check admin login
    if (email === adminUser.email && password === adminUser.password) {
      user = adminUser;
    } else {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/`);
        user = res.data.find(
          (u) => u.email === email && u.password === password
        );
      } catch (err) {
        return setError("Login failed. Please try again.");
      }
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      alert(`${user.role} login successful!`);

      // Navigate to correct dashboard
      const dashboardPath =
        user.role === "admin"
          ? "/admindashboard"
          : user.role === "employer"
          ? "/empdashboard"
          : "/jobs";

      navigate(dashboardPath);
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-3">🔐 Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-2"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            autoFocus
          />
          <input
            type="password"
            className="form-control mb-3"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
          />
          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-1">Don't have an account?</p>
          <Link to="/register" className="btn btn-outline-success w-100">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
