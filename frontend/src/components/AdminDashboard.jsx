import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [jobseekers, setJobseekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [jobRes, empRes] = await Promise.all([
        axios.get("http://localhost:3000/users?role=jobseeker"),
        axios.get("http://localhost:3000/users?role=employer"),
      ]);
      setJobseekers(jobRes.data);
      setEmployers(empRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        alert("User deleted");
        fetchUsers();
      } catch (err) {
        alert("Error deleting user.");
      }
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛠️ Admin Dashboard</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Employers List */}
          <h4 className="mt-4">🏢 Employers</h4>
          {employers.length === 0 ? (
            <p>No employers found.</p>
          ) : (
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
                  {employers.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.role}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Jobseekers List */}
          <h4 className="mt-5">👥 Job Seekers</h4>
          {jobseekers.length === 0 ? (
            <p>No jobseekers found.</p>
          ) : (
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
                  {jobseekers.map((js) => (
                    <tr key={js.id}>
                      <td>{js.id}</td>
                      <td>{js.name}</td>
                      <td>{js.email}</td>
                      <td>{js.role}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(js.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
