import React from "react";
import "./main.css";

const teamMembers = [
  { name: "Vraj Shah", role: "Developer & UI/UX Designer", image: "/images/vraj shah.jpeg", linkedin: "https://www.linkedin.com/in/vraj-shah-5b4127297", github: "https://github.com/Vraj26shah" },
  { name: "Umanshi Goyal", role: "Developer & UI/UX Designer", image: "team-member.jpg", linkedin: "#", github: "#" },
  { name: "Prarabdh Soni", role: "Backend Developer", image: "team-member.jpg", linkedin: "#", github: "#" },
  { name: "Pragalbh Sharma", role: "Machine Learning", image: "team-member.jpg", linkedin: "#", github: "#" },
  { name: "Shaurya Pathak", role: "Machine Learning", image: "team-member.jpg", linkedin: "#", github: "#" },
  { name: "Muskan Srivastav", role: "Backend Developer", image: "team-member.jpg", linkedin: "#", github: "#" },
];

const Team = () => {
  return (
    <section className="team-members">
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
  );
};

export default Team;
