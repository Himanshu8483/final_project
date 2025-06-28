import React, { useEffect, useState } from "react";
import axios from "axios";

// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://himanshukush.pythonanywhere.com";
// const API_BASE_URL = "http://localhost:3000"; 



function AdminDashboard() {
  const [employers, setEmployers] = useState([]);
  const [jobseekers, setJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const itemsPerPage = 5;
  const [empPage, setEmpPage] = useState(1);
  const [jsPage, setJsPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/`);
      const users = res.data || [];

      setEmployers(users.filter((u) => u.role === "employer"));
      setJobseekers(users.filter((u) => u.role === "jobseeker"));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${id}/`);
        alert("User deleted successfully!");
        fetchUsers();
      } catch (err) {
        alert("Error deleting user.");
        console.error(err);
      }
    }
  };

  const paginate = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderTable = (data, page, setPage, totalPages, title) => (
    <>
      <h4 className="mt-4">{title}</h4>
      {data.length === 0 ? (
        <p>No {title.toLowerCase()} found.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginate(data, page).map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ⬅ Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </>
  );

  const totalEmpPages = Math.ceil(employers.length / itemsPerPage);
  const totalJsPages = Math.ceil(jobseekers.length / itemsPerPage);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛠️ Admin Dashboard</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {renderTable(employers, empPage, setEmpPage, totalEmpPages, "🏢 Employers")}
          {renderTable(jobseekers, jsPage, setJsPage, totalJsPages, "👥 Jobseekers")}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
