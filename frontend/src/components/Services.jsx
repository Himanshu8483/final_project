const Services = () => (
  <div className="container py-5">
    <h1 className="text-center mb-4">Our Services</h1>
    <div className="row">
      {["Resume Building", "Interview Preparation", "Job Alerts", "Career Counseling"].map((service, i) => (
        <div key={i} className="col-md-3 mb-4">
          <div className="card h-100 shadow text-center p-3">
            <div className="card-body">
              <h5 className="card-title">{service}</h5>
              <p className="card-text">We help you with {service.toLowerCase()} to boost your chances of success.</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default Services;
