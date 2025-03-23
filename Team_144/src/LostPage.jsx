import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Search } from "lucide-react";
import "./LostPage.css";

const lostItems = [
  {
    id: 1,
    image: "./iphone.jpg",
    name: "iPhone 13 Pro",
    date: "2023-03-15",
    mobile: "9876543210",
    description: "Lost in the university cafeteria. Has a blue case with stickers.",
    location: "vit",
    owner: { name: "Parth Sharma", address: "Room 302, Men's Hostel, VIT", phone: "9876543210" },
  },
  {
    id: 2,
    image: "./wallet.jpg",
    name: "Black Wallet",
    date: "2023-03-18",
    mobile: "8765432109",
    description: "Contains ID card and some cash. Lost near the library.",
    location: "vit",
    owner: { name: "Rahul Verma", address: "Room 205, Men's Hostel, VIT", phone: "8765432109" },
  },
  {
    id: 3,
    image: "./bag.jpg",
    name: "Laptop Bag",
    date: "2023-03-20",
    mobile: "7654321098",
    description: "Black Dell laptop bag with charger and mouse inside. Lost in the lecture hall.",
    location: "vit",
    owner: { name: "Ananya Patel", address: "Room 112, Women's Hostel, VIT", phone: "7654321098" },
  },
];

const LostPage = () => {
  const [verifying, setVerifying] = useState(null);
  const [verified, setVerified] = useState(null);
  const [answer, setAnswer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleVerify = (id) => {
    if (verifying === id) {
      if (answer.toLowerCase() === "vit") {
        setVerified(id);
        setVerifying(null);
      } else {
        alert("Incorrect answer. Please try again.");
      }
      setAnswer("");
    } else {
      setVerifying(id);
      setVerified(null);
    }
  };

  const filteredItems = lostItems.filter((item) =>
    [item.name, item.description].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container">
      <div className="wrapper">
        <div className="header">
          <button onClick={() => navigate("/")} className="back-link">
            <ArrowLeft className="mr-2" size={20} />
            {/* <span>Back to Home</span> */}
          </button>
          <h1 className="header-title">Lost Items</h1>
        </div>

        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for lost items..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredItems.length === 0 ? (
          <p className="text-center">No items match your search.</p>
        ) : (
          <div className="grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="card">
                <img src={item.image} alt={item.name} width={300} height={200} className="card-image" />
                <div className="card-body">
                  <div className="card-title">{item.name}</div>
                  <div className="card-info">Date: {item.date}</div>
                  <div className="card-info">Contact: {item.mobile}</div>
                  <div className="card-info">{item.description}</div>

                  {verified === item.id ? (
                    <div className="owner-box">
                      <h4>
                        <Check size={18} /> Owner Details
                      </h4>
                      <p><b>Name:</b> {item.owner.name}</p>
                      <p><b>Address:</b> {item.owner.address}</p>
                      <p><b>Phone:</b> {item.owner.phone}</p>
                    </div>
                  ) : verifying === item.id ? (
                    <div className="verification-box">
                      <h4>Verification</h4>
                      <p>Where was this item found? (Hint: college name)</p>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="verification-input"
                      />
                      <button onClick={() => handleVerify(item.id)} className="verify-btn">
                        Submit
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleVerify(item.id)} className="verify-btn">
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LostPage;
