import React, { useState, useEffect } from "react";
import axios from "axios";

function PostJob() {
  const user = JSON.parse(localStorage.getItem("user")); // should be employer
  const [form, setForm] = useState({ title: "", description: "" });
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (user?.id) fetchJobs();
  }, []);

  const fetchJobs = () => {
    axios.get(`http://localhost:3000/jobs?employerId=${user.id}`)
      .then(res => setJobs(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return alert("Please fill all fields");

    const jobData = { ...form, employerId: user.id };

    if (editId) {
      axios.put(`http://localhost:3000/jobs/${editId}`, jobData)
        .then(() => {
          alert("Job updated!");
          resetForm();
          fetchJobs();
        });
    } else {
      axios.post("http://localhost:3000/jobs", jobData)
        .then(() => {
          alert("Job posted!");
          resetForm();
          fetchJobs();
        });
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

  const handleDelete = (id) => {
    if (window.confirm("Delete this job?")) {
      axios.delete(`http://localhost:3000/jobs/${id}`).then(fetchJobs);
    }
  };

  if (user?.role !== "employer") {
    return <div className="text-danger text-center mt-4">Only employers can post jobs.</div>;
  }

  return (
    <div className="container py-4">
      <h2>{editId ? "Edit Job" : "Post a Job"}</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input className="form-control mb-2" placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="form-control mb-2" placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn btn-success">{editId ? "Update" : "Post"}</button>
      </form>

      <div className="row">
        {jobs.map(job => (
          <div className="col-md-4 mb-3" key={job.id}>
            <div className="card">
              <div className="card-body">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(job)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostJob;
