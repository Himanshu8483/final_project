import React, { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const userId = 1; // Simulating a logged-in user

  // Fetch jobs and user's applications
  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = () => {
    axios.get("http://localhost:3000/jobs/").then((res) => setJobs(res.data));
  };

  const fetchApplications = () => {
    axios
      .get(`http://localhost:3000/applications?userId=${userId}`)
      .then((res) => setApplications(res.data));
  };

  const handleApply = (jobId) => {
    const alreadyApplied = applications.some(app => app.jobId === jobId);
    if (!alreadyApplied) {
      axios.post("http://localhost:3000/applications", {
        userId,
        jobId
      }).then(() => {
        alert("Application submitted!");
        fetchApplications();
      });
    }
  };

  const handleCancel = (jobId) => {
    const app = applications.find(app => app.jobId === jobId);
    if (app) {
      axios.delete(`http://localhost:3000/applications/${app.id}`).then(() => {
        alert("Application cancelled.");
        fetchApplications();
      });
    }
  };

  const isApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Available Jobs</h2>
      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-4 mb-4" key={job.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description}</p>
              </div>
              <div className="card-footer">
                {isApplied(job.id) ? (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleCancel(job.id)}
                  >
                    Cancel Application
                  </button>
                ) : (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleApply(job.id)}
                  >
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
