import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home-container">
      {/* Background Section */}
      <div className="background">
        <img src="./background.png.jpg" alt="Background" className="background-image" />
        <div className="overlay"></div>
      </div>

      {/* Content Section */}
      <div className="content">
        <h1 className="title">TraceIt</h1>
        <p className="description">
          Find your lost items, report found items, or sell items you no longer need.
        </p>

        <div className="button-container">
          {[
            { label: "Lost Items", path: "/lost", className: "lost" },
            { label: "Found Something?", path: "/found", className: "found" },
            { label: "Sell Items", path: "/sell", className: "sell" },
          ].map((btn) => (
            <button key={btn.path} className={`button ${btn.className}`} onClick={() => navigate(btn.path)}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
