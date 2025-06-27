import React, { useEffect, useState } from "react";
import axios from "axios";

// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://himanshukush.pythonanywhere.com"; 



function Jobs() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({});
  const [resumeFiles, setResumeFiles] = useState({});
  const [showFormId, setShowFormId] = useState(null);

  useEffect(() => {
    if (userId) fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [jobRes, userRes, appRes, postRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/jobs`),
        axios.get(`${API_BASE_URL}/users`),
        axios.get(`${API_BASE_URL}/applications?userId=${userId}`),
        axios.get(`${API_BASE_URL}/posts?jobSeekerId=${userId}`),
      ]);

      setJobs(jobRes.data);
      setUsers(userRes.data);
      setApplications(appRes.data);
      setPosts(postRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const isApplied = (jobId) => applications.some((app) => app.jobId === jobId);

  const getPost = (jobId) =>
    posts.find((p) => p.jobId === jobId && p.jobSeekerId === userId);

  const getEmployer = (employerId) => users.find((u) => u.id === employerId);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleResumeChange = (jobId, file) => {
    setResumeFiles((prev) => ({ ...prev, [jobId]: file }));
  };

  const handleFormChange = (jobId, value) => {
    setForm((prev) => ({ ...prev, [jobId]: { message: value } }));
  };

  const handleApply = async (job) => {
    if (isApplied(job.id)) return alert("Already applied!");

    try {
      await axios.post(`${API_BASE_URL}/applications/`, {
        userId,
        jobId: job.id,
      });

      const resumeBase64 = resumeFiles[job.id]
        ? await toBase64(resumeFiles[job.id])
        : "";

      await axios.post(`${API_BASE_URL}/posts/`, {
        title: `Application for ${job.title}`,
        description: form[job.id]?.message || "No message provided.",
        resume: resumeBase64,
        jobSeekerId: userId,
        jobId: job.id,
        employerId: job.employerId,
        dateSent: new Date().toISOString(),
        status: "pending",
      });

      alert("✅ Application submitted!");
      fetchAllData();
      setShowFormId(null);
    } catch (err) {
      console.error("Error applying:", err);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📋 Available Jobs</h2>
      <div className="row">
        {jobs.map((job) => {
          const applied = isApplied(job.id);
          const post = getPost(job.id);
          const employer = getEmployer(job.employerId);

          return (
            <div className="col-md-4 mb-4" key={job.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">{job.description}</p>

                  {employer && (
                    <p className="text-muted small">
                      👤 <strong>{employer.name}</strong><br />
                      📧 {employer.email}
                    </p>
                  )}

                  {post && (
                    <div className="mb-2">
                      <strong>Status: </strong>
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
                      {post.status === "accepted" && post.interviewDate && (
                        <>
                          <br />
                          🗓️ Interview: {new Date(post.interviewDate).toLocaleString()}
                        </>
                      )}
                    </div>
                  )}

                  {applied ? (
                    <button className="btn btn-outline-secondary btn-sm" disabled>
                      ✅ {post?.status === "rejected" ? "Rejected" : "Applied"}
                    </button>
                  ) : showFormId === job.id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        placeholder="Your message"
                        onChange={(e) => handleFormChange(job.id, e.target.value)}
                      />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="form-control mb-2"
                        onChange={(e) => handleResumeChange(job.id, e.target.files[0])}
                      />
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApply(job)}
                        >
                          Submit
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setShowFormId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowFormId(job.id)}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Jobs;
