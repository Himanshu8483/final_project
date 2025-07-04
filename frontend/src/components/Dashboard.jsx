import React from "react";
import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebookF, FaInstagram, FaLinkedin, FaArrowUp } from "react-icons/fa";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const role = user?.role?.toLowerCase();

  const isEmployer = role === "employer";
  const isAdmin = role === "admin";
  const isJobSeeker = role === "jobseeker";

  return (
    <>
    <div className="d-flex flex-column min-vh-100">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/">
          Hire<span className="text-white">Hub</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left side nav */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">
                Services
              </NavLink>
            </li>

            {isJobSeeker && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/jobs">
                  Jobs
                </NavLink>
              </li>
            )}

            {isEmployer && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/postjob">
                    Post Job
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/premium">
                    Premium
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/empdashboard">
                    Employer Dashboard
                  </NavLink>
                </li>
              </>
            )}

            {isAdmin && (
              <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/adminjobs">
                  Job Detail
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admindashboard">
                  Admin Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/adminpremium">
                  Premium Dashboard
                </NavLink>
              </li>
              </>
            )}
          </ul>

          {/* Right side */}
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item d-flex align-items-center text-white me-3">
                  <span>
                    {user.role}: {user.name || user.email}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link to="/login" className="btn btn-outline-primary">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-outline-success">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
      <main>
        <Outlet />
      </main>

    <footer className="bg-dark text-white pt-4 pb-3 mt-auto">
      <div className="container">
        <div className="row text-center text-md-start">
          
          {/* Logo & Description */}
          <div className="col-12 col-md-4 mb-3">
            <h4>
              <Link className="navbar-brand fw-bold text-warning" to="/">
              Hire<span className="text-white">Hub</span>
            </Link>
            </h4>
            <p className="mb-0">Bringing opportunities closer to you.</p>
          </div>

          {/* Navigation Links */}
            <div className="col-12 col-md-4 mb-3">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white text-decoration-none d-block">Home</Link></li>
                <li><Link to="/about" className="text-white text-decoration-none d-block">About</Link></li>
                <li><Link to="/services" className="text-white text-decoration-none d-block">Services</Link></li>
                <li><Link to="/home" className="text-white text-decoration-none d-block">Contact</Link></li>
              </ul>
            </div>

          {/* Social Media Icons */}
          <div className="col-12 col-md-4 mb-3">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="https://facebook.com" className="text-white fs-5"><FaFacebookF /></a>
              <a href="https://instagram.com" className="text-white fs-5"><FaInstagram /></a>
              <a href="https://linkedin.com" className="text-white fs-5"><FaLinkedin /></a>
            </div>
          </div>

        </div>

        <hr className="bg-white" />

        <div className="text-center">
          <p className="mb-0">© 2025 HireHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
    </>
  );
}

export default Dashboard;
