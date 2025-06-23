import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PostJob() {
  const user = JSON.parse(localStorage.getItem("user")); // should be employer
  const [form, setForm] = useState({ title: "", description: "" });
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [subscription, setSubscription] = useState(null); // ← holds active subscription

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
      fetchSubscription();
    }
  }, []);

  const fetchJobs = async () => {
    const res = await axios.get(`http://localhost:3000/jobs?employerId=${user.id}`);
    setJobs(res.data);
  };

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/orders?userId=${user.id}&status=active`);
      const active = res.data.find(order => new Date(order.expiryDate) > new Date());
      if (active) setSubscription(active);
    } catch (err) {
      console.error("Failed to fetch subscription", err);
    }
  };

  const isPremium = !!subscription; // only true if active & not expired

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return alert("Please fill all fields");

    if (!isPremium && jobs.length >= 3 && !editId) {
      alert("You can only post 3 jobs as a free employer. Upgrade to premium!");
      return;
    }

    const jobData = {
      ...form,
      employerId: user.id,
      priority: isPremium ? 1 : 0,
    };

    if (editId) {
      await axios.put(`http://localhost:3000/jobs/${editId}`, jobData);
      alert("Job updated!");
    } else {
      await axios.post("http://localhost:3000/jobs", jobData);
      alert("Job posted!");
    }

    resetForm();
    fetchJobs();
  };

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setEditId(null);
  };

  const handleEdit = (job) => {
    setForm({ title: job.title, description: job.description });
    setEditId(job.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this job?")) {
      await axios.delete(`http://localhost:3000/jobs/${id}`);
      fetchJobs();
    }
  };

  if (user?.role !== "employer") {
    return <div className="text-danger text-center mt-4">Only employers can post jobs.</div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{editId ? "✏️ Edit Job" : "📝 Post a Job"}</h2>
        {isPremium ? (
          <span className="badge bg-success p-2">
            🌟 Premium (expires {new Date(subscription.expiryDate).toLocaleDateString()})
          </span>
        ) : (
          <span className="badge bg-secondary p-2">Free Employer</span>
        )}
      </div>

      {!isPremium && jobs.length >= 3 && !editId && (
        <div className="alert alert-warning">
          <strong>Limit Reached:</strong> Free employers can post only 3 jobs.
          <br />
          <Link to="/premium" className="btn btn-sm btn-outline-primary mt-2">
            Upgrade to Premium Now 🚀
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="form-control mb-2"
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Job Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="btn btn-success" disabled={!isPremium && jobs.length >= 3 && !editId}>
          {editId ? "Update Job" : "Post Job"}
        </button>
      </form>

      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-4 mb-3" key={job.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(job)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostJob;
