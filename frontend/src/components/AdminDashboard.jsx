import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [jobseekers, setJobseekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const itemsPerPage = 5;
  const [empPage, setEmpPage] = useState(1);
  const [jsPage, setJsPage] = useState(1);

  useEffect(() => {
    fetchUsersOneByOne();
  }, []);

  const fetchUsersOneByOne = async () => {
    setLoading(true);
    try {
      const jobRes = await axios.get("http://localhost:3000/users?role=jobseeker");
      const empRes = await axios.get("http://localhost:3000/users?role=employer");

      // Use forEach if you want to manually loop through (not needed here, but for demo):
      const jobList = [];
      jobRes.data.forEach(js => jobList.push(js));
      setJobseekers(jobList);

      const empList = [];
      empRes.data.forEach(emp => empList.push(emp));
      setEmployers(empList);

    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        alert("User deleted");
        fetchUsersOneByOne();
      } catch (err) {
        alert("Error deleting user.");
      }
    }
  };

  const paginate = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalEmpPages = Math.ceil(employers.length / itemsPerPage);
  const totalJsPages = Math.ceil(jobseekers.length / itemsPerPage);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛠️ Admin Dashboard</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Employers Table */}
          <h4 className="mt-4">🏢 Employers</h4>
          {employers.length === 0 ? (
            <p>No employers found.</p>
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
                    {paginate(employers, empPage).map((emp) => (
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
              <div className="d-flex justify-content-between mb-4">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={empPage === 1}
                  onClick={() => setEmpPage(empPage - 1)}
                >
                  ⬅ Prev
                </button>
                <span>
                  Page {empPage} of {totalEmpPages}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={empPage === totalEmpPages}
                  onClick={() => setEmpPage(empPage + 1)}
                >
                  Next ➡
                </button>
              </div>
            </>
          )}

          {/* Jobseekers Table */}
          <h4 className="mt-5">👥 Job Seekers</h4>
          {jobseekers.length === 0 ? (
            <p>No jobseekers found.</p>
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
                    {paginate(jobseekers, jsPage).map((js) => (
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
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={jsPage === 1}
                  onClick={() => setJsPage(jsPage - 1)}
                >
                  ⬅ Prev
                </button>
                <span>
                  Page {jsPage} of {totalJsPages}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={jsPage === totalJsPages}
                  onClick={() => setJsPage(jsPage + 1)}
                >
                  Next ➡
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
