import React from "react";
import "./main.css";

const Features = () => {
  return (
    <section id="features">
      <div className="feature-card">
        <h3>FixMyStreet</h3>
        <p>GPS-tagged photo and reporting</p>
      </div>
      <div className="feature-card">
        <h3>Green Guardian</h3>
        <p>Report illegal dumping</p>
      </div>
      <div className="feature-card">
        <h3>Noise Monitoring</h3>
        <p>Live neighborhood noise level tracking</p>
      </div>
    </section>
  );
};

export default Features;
