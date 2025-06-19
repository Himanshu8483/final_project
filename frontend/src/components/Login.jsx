import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password } = form;

  if (!email || !password) {
    return setError("Both fields are required.");
  }

  let user = null;

  // Check if admin
  if (email === adminUser.email && password === adminUser.password) {
    user = adminUser;
  } else {
    try {
      const res = await axios.get("http://localhost:3000/users");
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

    // ✅ ONE navigate
    const dashboardPath =
      user.role === "admin"
        ? "/admin-dashboard"
        : user.role === "employer"
        ? "/employer-dashboard"
        : "/jobseeker-dashboard";

    navigate(dashboardPath);
  } else {
    setError("Invalid email or password.");
  }
};

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2 className="text-center">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <br />
      <div className="text-center">
        <label className="form-label">Don't have an account?</label>
        <Link to="/register" className="btn btn-outline-success w-100 mb-3">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
