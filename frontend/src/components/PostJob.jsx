import React, { useState, useEffect } from "react";
import axios from "axios";

function PostJob() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch all jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    axios.get("http://localhost:3000/jobs/")
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`http://localhost:3000/jobs/${editId}`, form)
        .then(() => {
          alert("Job updated!");
          setForm({ title: "", description: "" });
          setEditId(null);
          fetchJobs();
        });
    } else {
      axios.post("http://localhost:3000/jobs/", form)
        .then(() => {
          alert("Job posted!");
          setForm({ title: "", description: "" });
          fetchJobs();
        });
    }
  };

  const handleEdit = (job) => {
    setForm({ title: job.title, description: job.description });
    setEditId(job.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this job?")) {
      axios.delete(`http://localhost:3000/jobs/${id}`)
        .then(() => {
          alert("Job deleted!");
          fetchJobs();
        });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">{editId ? "Edit Job" : "Post a Job"}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-5">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <button className="btn btn-success">
          {editId ? "Update Job" : "Post Job"}
        </button>
      </form>

      {/* Jobs List */}
      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-4 mb-4" key={job.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description}</p>
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
