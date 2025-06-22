// File: frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import PostJob from "./components/PostJob";
import Premium from "./components/Premium";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import About from "./components/About";
import Services from "./components/Services";
import './App.css'
import EmployerDashboard from "./components/EmployerDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="postjob" element={<PostJob />} />
          <Route path="premium" element={<Premium />} />
          <Route path="login" element={<Login />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="register" element={<Register />} />
          <Route path="empdashboard" element={<EmployerDashboard />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;