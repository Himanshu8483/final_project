const About = () => (
  <div className="container py-5">
    <h1 className="mb-4 text-center">About HireHub</h1>
    <p className="lead text-center">We are a team committed to helping job seekers connect with the right companies.</p>

    <div className="row mt-5">
      <div className="col-md-6">
        <img src="user.jpg" className="img-fluid rounded zoom-effect" width='500px' alt="Team" />
      </div>
      <div className="col-md-6 my-5">
        <h3>Our Mission</h3>
        <p className="px-5">We simplify job hunting through technology and partnerships with companies across industries. We strive to empower professionals and employers alike.</p>
      </div>
    </div>
  </div>
);
export default About;
