import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const employerId = user?.id;

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [interviewDate, setInterviewDate] = useState({});

  useEffect(() => {
    if (employerId) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [postRes, userRes] = await Promise.all([
        axios.get(`http://localhost:3000/posts?employerId=${employerId}`),
        axios.get("http://localhost:3000/users"),
      ]);
      setPosts(postRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getUserDetails = (id) => users.find((u) => u.id === id);

  const updateStatus = async (id, status, interviewDate = "") => {
    if (status === "accepted" && interviewDate) {
      const now = new Date();
      const selectedDate = new Date(interviewDate);

      if (selectedDate <= now) {
        alert("Interview date must be in the future (after current time).");
        return;
      }
    }

    try {
      await axios.patch(`http://localhost:3000/posts/${id}`, {
        status,
        interviewDate,
      });
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

            return (
              <div className="col-md-6 mb-4" key={post.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.description}</p>

                    <p className="text-muted">
                      👤 Name: {seeker?.name || "N/A"} <br />
                      📧 Email: {seeker?.email || "N/A"} <br />
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
                      {post.dateSent
                        ? new Date(post.dateSent).toLocaleDateString()
                        : "N/A"}
                      <br />
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
                          min={new Date(Date.now() + 60 * 1000)
                            .toISOString()
                            .slice(0, 16)}
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
                            updateStatus(
                              post.id,
                              "accepted",
                              interviewDate[post.id]
                            )
                          }
                        >
                          Set Interview
                        </button>
                      </div>
                    )}
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
