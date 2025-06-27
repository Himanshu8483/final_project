import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [sortJobBy, setSortJobBy] = useState("title");
  const [sortPostBy, setSortPostBy] = useState("date");
  const [selectedEmployer, setSelectedEmployer] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [jobsRes, postsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/jobs/`),
        axios.get(`${API_BASE_URL}/posts/`),
        axios.get(`${API_BASE_URL}/users/`)
      ]);
      setJobs(jobsRes.data);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getUserById = (id) => users.find((u) => u.id === id);
  const employers = users.filter((u) => u.role === "employer");

  const filteredJobs = jobs
    .filter((job) => {
      const emp = getUserById(job.employerId);
      const q = search.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        emp?.name?.toLowerCase().includes(q)
      );
    })
    .filter((job) => (selectedEmployer ? job.employerId === +selectedEmployer : true))
    .sort((a, b) => {
      if (sortJobBy === "title") return a.title.localeCompare(b.title);
      if (sortJobBy === "description") return a.description.localeCompare(b.description);
      if (sortJobBy === "employer") {
        const aEmp = getUserById(a.employerId)?.name || "";
        const bEmp = getUserById(b.employerId)?.name || "";
        return aEmp.localeCompare(bEmp);
      }
      return 0;
    });

  const filteredPosts = posts
    .filter((post) => {
      const seeker = getUserById(post.jobSeekerId);
      const q = search.toLowerCase();
      return (
        post.title?.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        seeker?.name?.toLowerCase().includes(q)
      );
    })
    .filter((post) => (selectedEmployer ? post.employerId === +selectedEmployer : true))
    .sort((a, b) => {
      if (sortPostBy === "status") return a.status.localeCompare(b.status);
      if (sortPostBy === "date") return new Date(b.dateSent) - new Date(a.dateSent);
      return 0;
    });

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛠️ Admin: All Jobs & Applications</h2>

      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by job, user, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={selectedEmployer}
            onChange={(e) => setSelectedEmployer(e.target.value)}
          >
            <option value="">🔽 Filter by Employer</option>
            {employers.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4>📢 All Posted Jobs</h4>
        <select
          className="form-select w-auto"
          onChange={(e) => setSortJobBy(e.target.value)}
        >
          <option value="title">Sort by Title</option>
          <option value="description">Sort by Description</option>
          <option value="employer">Sort by Employer</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="alert alert-info">No jobs found.</div>
      ) : (
        <div className="row mb-5">
          {filteredJobs.map((job) => {
            const emp = getUserById(job.employerId);
            return (
              <div className="col-md-4 mb-3" key={job.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="card-text">{job.description}</p>
                    <p className="text-muted">
                      👤 Employer: {emp?.name || "Unknown"} <br />
                      📧 {emp?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Posts Section */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4>📥 All Applications</h4>
        <select
          className="form-select w-auto"
          onChange={(e) => setSortPostBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="alert alert-warning">No applications found.</div>
      ) : (
        <div className="row">
          {filteredPosts.map((post) => {
            const job = jobs.find((j) => j.id === post.jobId);
            const seeker = getUserById(post.jobSeekerId);
            const emp = getUserById(post.employerId);
            return (
              <div className="col-md-6 mb-4" key={post.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{job?.title || post.title}</h5>
                    <p className="card-text">{post.description}</p>
                    <p className="text-muted">
                      👤 Candidate: {seeker?.name || "Unknown"} <br />
                      📧 {seeker?.email || "N/A"} <br />
                      📎 Resume:{" "}
                      {post.resume ? (
                        <a
                          href={post.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                          download
                        >
                          View & Download
                        </a>
                      ) : (
                        "Not uploaded"
                      )}
                      <br />
                      🧑‍💼 Employer: {emp?.name || "Unknown"} ({emp?.email || "N/A"}) <br />
                      📅 Applied On: {new Date(post.dateSent).toLocaleDateString()} <br />
                      🏷️ Status:{" "}
                      <span
                        className={
                          post.status === "accepted"
                            ? "text-success"
                            : post.status === "rejected"
                            ? "text-danger"
                            : "text-warning"
                        }
                      >
                        {post.status}
                      </span>
                      {post.interviewDate && (
                        <>
                          <br />
                          📅 Interview Date:{" "}
                          {new Date(post.interviewDate).toLocaleString()}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminJobs;
