import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const employerId = user?.id;

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (employerId) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/posts?employerId=${employerId}`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  if (!employerId) {
    return <div className="text-center text-danger">Please log in as an employer to view posts.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📥 Applications Received</h2>

      {posts.length === 0 ? (
        <div className="alert alert-info text-center">No job seeker applications found.</div>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-6 mb-4" key={post.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                  <p className="text-muted">
                    🧑 Job Seeker ID: {post.jobSeekerId} <br />
                    📅 Date: {new Date(post.dateSent).toLocaleDateString()} <br />
                    📌 Status: {post.status}
                  </p>
                  <button className="btn btn-outline-primary btn-sm">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;
