import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const employerId = user?.id;

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [interviewDate, setInterviewDate] = useState({});

  useEffect(() => {
    if (employerId) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [postRes, userRes, jobRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/posts`),
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/jobs?employerId=${employerId}`),
      ]);

      setUsers(userRes.data);
      setJobs(jobRes.data);

      const jobIds = jobRes.data.map(job => job.id);
      const filteredPosts = postRes.data.filter(post => jobIds.includes(post.jobId));
      setPosts(filteredPosts);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getUserDetails = (id) => users.find(u => u.id === id);

  const updateStatus = async (id, status, interviewDateInput = null) => {
    const payload = { status };

    if (interviewDateInput) {
      const now = new Date();
      const selected = new Date(interviewDateInput);
      if (selected <= now) {
        return alert("Interview date must be in the future.");
      }
      payload.interviewDate = interviewDateInput;
    } else {
      payload.interviewDate = null;
    }

    try {
      await axios.patch(`${API_BASE_URL}/posts/${id}/`, payload);
      fetchData();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📥 Applications Received</h2>

      {posts.length === 0 ? (
        <div className="alert alert-info text-center">No applications found.</div>
      ) : (
        <div className="row">
          {posts.map((post) => {
            const seeker = getUserDetails(post.jobSeekerId);
            const job = jobs.find(j => j.id === post.jobId);
            const status = post.status;

            return (
              <div className="col-md-6 mb-4" key={post.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{job?.title || "Untitled Job"}</h5>
                    <p className="card-text">{post.description}</p>
                    <p className="text-muted">
                      👤 {seeker?.name || "N/A"} <br />
                      📧 {seeker?.email || "N/A"} <br />
                      📎 Resume:{" "}
                      {post.resume ? (
                        <a
                          href={post.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="ms-2 btn btn-sm btn-outline-primary"
                          download
                        >
                          View & Download
                        </a>
                      ) : (
                        <span className="text-danger">No resume uploaded</span>
                      )}
                      <br />
                      📅 Applied On:{" "}
                      {post.dateSent ? new Date(post.dateSent).toLocaleDateString() : "N/A"}
                      <br />
                      🏷️ Status:{" "}
                      <span
                        className={
                          status === "accepted"
                            ? "text-success"
                            : status === "rejected"
                            ? "text-danger"
                            : "text-warning"
                        }
                      >
                        {status}
                      </span>
                      {post.interviewDate && (
                        <>
                          <br />
                          📅 Interview Date:{" "}
                          {new Date(post.interviewDate).toLocaleString()}
                        </>
                      )}
                    </p>

                    {/* Pending Actions */}
                    {status === "pending" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => updateStatus(post.id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => updateStatus(post.id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Accepted Actions */}
                    {status === "accepted" && (
                      <div className="mt-3">
                        <input
                          type="datetime-local"
                          className="form-control mb-2"
                          min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                          value={interviewDate[post.id] || ""}
                          onChange={(e) =>
                            setInterviewDate({
                              ...interviewDate,
                              [post.id]: e.target.value,
                            })
                          }
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              updateStatus(post.id, "accepted", interviewDate[post.id])
                            }
                          >
                            Set Interview
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => updateStatus(post.id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rejected → Accept again */}
                    {status === "rejected" && (
                      <div className="mt-3">
                        <input
                          type="datetime-local"
                          className="form-control mb-2"
                          min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                          value={interviewDate[post.id] || ""}
                          onChange={(e) =>
                            setInterviewDate({
                              ...interviewDate,
                              [post.id]: e.target.value,
                            })
                          }
                        />
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            updateStatus(post.id, "accepted", interviewDate[post.id])
                          }
                        >
                          Accept & Set Interview
                        </button>
                      </div>
                    )}
                    {/* 
                    {post.status === "pending" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => updateStatus(post.id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => updateStatus(post.id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {post.status === "accepted" && (
                      <div className="mt-3">
                        <input
                          type="datetime-local"
                          className="form-control mb-2"
                          min={new Date(Date.now() + 60 * 1000).toISOString().slice(0, 16)}
                          value={interviewDate[post.id] || ""}
                          onChange={(e) =>
                            setInterviewDate({
                              ...interviewDate,
                              [post.id]: e.target.value,
                            })
                          }
                        />
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            updateStatus(post.id, "accepted", interviewDate[post.id])
                          }
                        >
                          Set Interview
                        </button>
                      </div>
                    )} */}

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

export default EmployerDashboard;
