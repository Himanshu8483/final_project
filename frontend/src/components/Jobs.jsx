import React, { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const user = JSON.parse(localStorage.getItem("user")); // should be job seeker
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchJobs();
    if (user?.id) fetchApplications();
  }, []);

  const fetchJobs = () => {
    axios.get("http://localhost:3000/jobs").then(res => setJobs(res.data));
  };

  const fetchApplications = () => {
    axios.get(`http://localhost:3000/applications?userId=${user.id}`)
      .then(res => setApplications(res.data));
  };

  const handleApply = (jobId) => {
    if (applications.some(app => app.jobId === jobId)) return;

    axios.post("http://localhost:3000/applications", {
      userId: user.id,
      jobId
    }).then(() => {
      alert("Application submitted!");
      fetchApplications();
    });
  };

  const handleCancel = (jobId) => {
    const app = applications.find(a => a.jobId === jobId);
    if (app) {
      axios.delete(`http://localhost:3000/applications/${app.id}`)
        .then(() => {
          alert("Application cancelled.");
          fetchApplications();
        });
    }
  };

  const isApplied = (jobId) => applications.some(app => app.jobId === jobId);

  if (user?.role !== "jobseeker") {
    return <div className="text-danger text-center mt-4">Only job seekers can apply for jobs.</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Available Jobs</h2>
      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-4 mb-4" key={job.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
              </div>
              <div className="card-footer">
                {isApplied(job.id) ? (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(job.id)}>
                    Cancel Application
                  </button>
                ) : (
                  <button className="btn btn-success btn-sm" onClick={() => handleApply(job.id)}>
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
