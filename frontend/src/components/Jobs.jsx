import React, { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({});
  const [showFormId, setShowFormId] = useState(null);
  const [resumeFiles, setResumeFiles] = useState({});
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchPosts();
  }, []);

  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:3000/jobs");
    setJobs(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get(`http://localhost:3000/applications?userId=${userId}`);
    setApplications(res.data);
  };

  const fetchPosts = async () => {
    const res = await axios.get(`http://localhost:3000/posts?jobSeekerId=${userId}`);
    setPosts(res.data);
  };

  const isApplied = (jobId) => {
    return applications.some((app) => app.jobId === jobId);
  };

  const getPostStatus = (jobId) => {
    return posts.find((p) => p.jobSeekerId === userId && p.jobId === jobId);
  };

  const handleResumeChange = (jobId, file) => {
    setResumeFiles((prev) => ({ ...prev, [jobId]: file }));
  };

  const handleFormChange = (jobId, field, value) => {
    setForm({
      ...form,
      [jobId]: {
        ...form[jobId],
        [field]: value,
      },
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleApply = async (job) => {
    const alreadyApplied = isApplied(job.id);
    if (alreadyApplied) return;

    await axios.post("http://localhost:3000/applications", {
      userId,
      jobId: job.id,
    });

    let resumeBase64 = "";
    if (resumeFiles[job.id]) {
      resumeBase64 = await toBase64(resumeFiles[job.id]);
    }

    await axios.post("http://localhost:3000/posts", {
      title: `Application for ${job.title}`,
      description: form[job.id]?.message || "No message provided.",
      resume: resumeBase64,
      jobSeekerId: userId,
      jobId: job.id,
      employerId: job.employerId,
      dateSent: new Date().toISOString(),
      status: "pending",
    });

    alert("Application submitted!");
    fetchApplications();
    fetchPosts();
    setShowFormId(null);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📋 Available Jobs</h2>
      <div className="row">
        {jobs.map((job) => {
          const applied = isApplied(job.id);
          const post = getPostStatus(job.id);

          return (
            <div className="col-md-4 mb-4" key={job.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">{job.description}</p>

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
                          <strong>Interview:</strong>{" "}
                          {new Date(post.interviewDate).toLocaleString()}
                        </>
                      )}
                    </div>
                  )}

                  {applied ? (
                    post?.status === "rejected" ? (
                      <div className="text-danger">❌ Rejected by employer</div>
                    ) : (
                      <button className="btn btn-outline-secondary btn-sm" disabled>
                        ✅ Applied
                      </button>
                    )
                  ) : showFormId === job.id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        placeholder="Your message"
                        onChange={(e) =>
                          handleFormChange(job.id, "message", e.target.value)
                        }
                      ></textarea>

                      <input
                        className="form-control mb-2"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          handleResumeChange(job.id, e.target.files[0])
                        }
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
