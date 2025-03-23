import { Link } from "react-router-dom";
import "./main.css";
import UrbanEye from "../../assets/images/LOGO.png";
import Prarabdh from "../../assets/images/Prarabdh Soni.jpeg";
import Pragalbh from "../../assets/images/Pragalbh.png";
import Muskan from "../../assets/images/Muskhan.jpg";
import Shaurya from "../../assets/images/Shoryra.jpg";
import Umanshi from "../../assets/images/Umanshi.jpg";
import Vraj from "../../assets/images/Vraj.jpg";

const Hero = () => {

    const teamMembers = [
        { name: "Prarabdh Soni", role: "Backend Developer", image: Prarabdh, linkedin: "https://www.linkedin.com/in/prarabdh-soni/", github: "https://github.com/PrarabdhSoni" },
        { name: "Umanshi Goyal", role: "Developer & UI/UX Designer", image: Umanshi, linkedin: "https://www.linkedin.com/in/umanshi-goyal-407ba8289/", github: "https://github.com/goelumanshi" },
        { name: "Vraj Shah", role: "Developer & UI/UX Designer", image: Vraj, linkedin: "https://www.linkedin.com/in/vraj-shah-5b4127297", github: "https://github.com/Vraj26shah" },
        { name: "Pragalbh Sharma", role: "Machine Learning", image: Pragalbh, linkedin: "https://www.linkedin.com/in/pragalbh-sharma-b3146b311/", github: "https://github.com/pragalbhsharma" },
        { name: "Shorya Pathak", role: "Machine Learning", image: Shaurya, linkedin: "https://www.linkedin.com/in/shorya-pathak-a8950228a/", github: "https://github.com/Shorya783" },
        { name: "Muskan Srivastav", role: "Backend Developer", image: Muskan, linkedin: "https://www.linkedin.com/in/algonomad571", github: "https://github.com/algonomad571" },
      ];

  return (
    <div>
        <nav>
          <div className="brand">
            <img src={UrbanEye} alt="Urban Eye Logo" className="nav-logo" />
            <h1>Urban Eye</h1>
          </div>
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </nav>
    <section className="hero">
      <h2>Your Neighborhood Guardian</h2>
      <p>Everyday Eyes for Everyday Issues</p>
      <Link to="/features">Explore Features</Link>
    </section>
    <section id="features">
      <div className="feature-card">
        <h3>Automated Civic Issue Prioritization</h3>
        <p>Uses AI-driven severity scoring to classify and prioritize complaints based on urgency, ensuring critical issues get addressed first.
        </p>
      </div>
      <div className="feature-card">
        <h3>Intelligent Anomaly Detection</h3>
        <p>Identifies unusual complaint patterns using machine learning, helping authorities detect recurring or critical civic problems.
        </p>
      </div>
      <div className="feature-card">
        <h3>Smart Resolution Time Prediction</h3>
        <p>Estimates complaint resolution times based on historical data, enabling better resource allocation and improved public service efficiency.</p>
      </div>
    </section>
    <section className="why-us" id="about">
        <h2>Why Urban Eye?</h2>
        <ul>
            <li>We turn overlooked issues into actionable solutions.</li>
            <li>Transparent issue resolution tracking</li>
            <li>Community-powered safety solutions</li>
        </ul>
    </section>
    <section className="team-members" id="team">
      <h2>Our Development Team</h2>
      <div className="member-cards-container">
        {teamMembers.map((member, index) => (
          <div key={index} className="member-card">
            <div className="member-image-container">
              <img src={member.image} alt={member.name} />
            </div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <div className="social-links">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={member.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        ))}
      </div>
    </section>
    <footer>
      <div className="footer-content">
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="mailto:contact@urbaneye.com">Contact</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>CONNECT WITH US</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/yourpage" target="_blank" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com/yourhandle" target="_blank" className="social-icon" style={{color: 'white'}}><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" alt="Twitter X Logo" width="20" style={{color: 'white'}}/></a>
            <a href="https://www.linkedin.com/company/yourprofile" target="_blank" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            <a href="https://www.instagram.com/yourprofile" target="_blank" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/yourprofile" target="_blank" className="social-icon"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Urban Eye. All Rights Reserved.</p>
      </div>
    </footer>
    </div>
  );
};

export default Hero;
