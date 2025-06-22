import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [jobsRes, postsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:3000/jobs"),
        axios.get("http://localhost:3000/posts"),
        axios.get("http://localhost:3000/users"),
      ]);

      setJobs(jobsRes.data);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
      setEmployers(usersRes.data.filter((u) => u.role === "employer"));
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const getUserById = (id) => users.find((u) => u.id === id);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛠️ All Jobs</h2>

      <h4 className="mb-3">📢 All Posted Jobs</h4>
      {jobs.length === 0 ? (
        <div className="alert alert-info">No jobs found.</div>
      ) : (
        <div className="row mb-5">
          {jobs.map((job) => {
            const employer = getUserById(job.employerId);
            return (
              <div className="col-md-4 mb-3" key={job.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="card-text">{job.description}</p>
                    <p className="text-muted">
                      👤 Employer: {employer?.name || "Unknown"} <br />
                      📧 {employer?.email}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h4 className="mb-3">📥 All Applications</h4>
      {posts.length === 0 ? (
        <div className="alert alert-warning">No applications received.</div>
      ) : (
        <div className="row">
          {posts.map((post) => {
            const job = jobs.find((j) => j.id === post.jobId);
            const seeker = getUserById(post.jobSeekerId);
            const employer = getUserById(post.employerId);

            return (
              <div className="col-md-6 mb-4" key={post.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.description}</p>
                    <p className="text-muted">
                      👤 Candidate: {seeker?.name} <br />
                      📧 Email: {seeker?.email} <br />
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
                      🧑‍💼 Employer: {employer?.name} ({employer?.email}) <br />
                      📅 Applied On:{" "}
                      {new Date(post.dateSent).toLocaleDateString()} <br />
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
                          <br />📅 Interview Date:{" "}
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
