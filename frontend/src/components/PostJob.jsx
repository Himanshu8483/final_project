import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// const API_BASE_URL = "http://localhost:8000"; 
const API_BASE_URL = "https://himanshukush.pythonanywhere.com"; 
// const API_BASE_URL = "http://localhost:3000"; 



function PostJob() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ title: "", description: "" });
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEmployer = user?.role === "employer";

  useEffect(() => {
    if (user?.id && isEmployer) {
      fetchJobs();
      fetchSubscription();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/jobs?employerId=${user.id}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders?userId=${user.id}&status=active`);
      const active = res.data.find(order => new Date(order.expiryDate) > new Date());
      if (active) setSubscription(active);
    } catch (err) {
      console.error("Failed to fetch subscription", err);
    }
  };

  const isPremium = !!subscription;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !description) {
      alert("Please fill in both the job title and description.");
      return;
    }

    const isDuplicate = jobs.some(
      (job) =>
        job.title.trim().toLowerCase() === title.toLowerCase() &&
        job.description.trim().toLowerCase() === description.toLowerCase() &&
        (!editId || job.id !== editId)
    );

    if (isDuplicate) {
      alert("This job already exists.");
      return;
    }

    if (!isPremium && jobs.length >= 3 && !editId) {
      alert("You can only post 3 jobs as a free employer. Upgrade to premium!");
      return;
    }

    const jobData = {
      title,
      description,
      employerId: user.id,
      priority: isPremium ? 1 : 0,
    };

    try {
      setLoading(true);
      if (editId) {
        await axios.put(`${API_BASE_URL}/jobs/${editId}/`, jobData);
        alert("Job updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/jobs/`, jobData);
        alert("Job posted successfully!");
      }
      resetForm();
      fetchJobs();
    } catch (err) {
      console.error("Error posting job", err);
      alert("Something went wrong while saving the job.");
    } finally {
      setLoading(false);
    }
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
      try {
        await axios.delete(`${API_BASE_URL}/jobs/${id}/`);
        fetchJobs();
      } catch (err) {
        console.error("Error deleting job", err);
        alert("Failed to delete job.");
      }
    }
  };

  if (!isEmployer) {
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
        <button
          className="btn btn-success"
          disabled={loading || (!isPremium && jobs.length >= 3 && !editId)}
        >
          {loading ? "Submitting..." : editId ? "Update Job" : "Post Job"}
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
