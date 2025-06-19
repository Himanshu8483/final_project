import React from 'react';

const Home = () => {
  return (
    <div>
      <marquee className="bg-success text-white py-2 fs-5">
        Welcome to HireHub - Bringing Opportunities Closer to You!
      </marquee>

      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-4">Find Your Dream Job Today</h1>
            <p className="lead">Explore thousands of job opportunities tailored for your career goals.</p>
          </div>
          <div className="col-md-6">
            
            <img src="admission.jpg" className="img-fluid rounded" alt="Job Search" />
          </div>
        </div>

       
        <hr className="my-5" />

        <h2 className="text-center mb-4">Watch How HireHub Works</h2>
      <div className="container">
        <div className="row g-2">
          <div className="col-12 col-md-6 text-center">
            <video autoPlay muted loop className="rounded w-100" src="video1.mp4"></video>
          </div>
          <div className="col-12 col-md-6 text-center">
            <video autoPlay muted loop className="rounded w-100" src="video2.mp4"></video>
          </div>
        </div>
      </div>
      
       <hr className="my-5" />

        <h2 className="text-center mb-4">Why Choose HireHub?</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow">
              <img src="student.jpg" className="card-img-top zoom-effect" alt="Growth" />
              <div className="card-body">
                <h5 className="card-title">Career Growth</h5>
                <p className="card-text">Opportunities that match your ambition and skills.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow">
              <img src="college.jpg" className="card-img-top zoom-effect" alt="Interviews" />
              <div className="card-body">
                <h5 className="card-title">Expert Guidance</h5>
                <p className="card-text">Get support from experts to prepare and succeed.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow">
              <img src="report.jpg" className="card-img-top zoom-effect" alt="Resume" />
              <div className="card-body">
                <h5 className="card-title">Smart Resume</h5>
                <p className="card-text">Build a resume that stands out and gets noticed.</p>
              </div>
            </div>
          </div>
        </div>


<div id="videoTextCarousel" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">

    <div className="carousel-item active">
      <section className="container-fluid py-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
            <video autoPlay muted loop className="rounded w-100 animate__animated animate__fadeInLeft">
              <source src="video1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="col-12 col-md-6 text-center text-md-start animate__animated animate__fadeInRight">
            <h2 className="mb-3">Join Thousands of Professionals</h2>
            <p className="mb-4">CareerMint is your partner in career growth — discover jobs, connect with recruiters, and thrive professionally.</p>
            <a href="" className="btn btn-primary px-4 py-2">Get Started</a>
          </div>
        </div>
      </section>
    </div>

    <div className="carousel-item">
      <section className="container-fluid py-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
            <video autoPlay muted loop className="rounded w-100 animate__animated animate__fadeInLeft">
              <source src="video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="col-12 col-md-6 text-center text-md-start animate__animated animate__fadeInRight">
            <h2 className="mb-3">With tools built for modern hiring needs.</h2>
            <p className="mb-4">CareerMint is your partner in career growth — discover jobs, connect with recruiters, and thrive professionally.</p>
            <a href="" className="btn btn-primary px-4 py-2">Get Started</a>
          </div>
        </div>
      </section>
    </div>

  </div>

  <button className="carousel-control-prev" type="button" data-bs-target="#videoTextCarousel" data-bs-slide="prev">
    <span className="carousel-control-prev-icon"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#videoTextCarousel" data-bs-slide="next">
    <span className="carousel-control-next-icon"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>

<section className="container-fluid py-5">
  <div className="row align-items-center">
    <div className="col-12 col-md-6 text-center text-md-start">
      <h2 className="mb-3">Empowering Job Seekers & Recruiters</h2>
      <p className="mb-4">With tools built for modern hiring needs, we help match talent with opportunity.</p>
      <a href="" className="btn btn-success px-4 py-2 mb-4">Visit Your Profile</a>
    </div>
          <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
        <div className="image-slider rounded w-100 mx-auto "></div>
      </div>
  </div>
</section>
      </div>
    </div>
  );
};

export default Home;
