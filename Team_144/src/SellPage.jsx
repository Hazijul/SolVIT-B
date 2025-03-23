import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Search } from "lucide-react";
import "./SellPage.css";

// Sample sell items data
const sellItems = [
  {
    id: 1,
    image: "./bike.jpg",
    name: "Mountain Bike",
    price: "₹12,500",
    seller: "Aditya Sharma",
    mobile: "9876543210",
    description: "Barely used mountain bike in excellent condition. 21 gears, front suspension.",
  },
  {
    id: 2,
    image: "./table.jpg",
    name: "Study Table",
    price: "₹3,500",
    seller: "Neha Gupta",
    mobile: "8765432109",
    description: "Wooden study table with drawer. 3 years old but well maintained.",
  },
  {
    id: 3,
    image: "./laptop",
    name: "Gaming Laptop",
    price: "₹45,000",
    seller: "Rohan Patel",
    mobile: "7654321098",
    description: "Asus ROG gaming laptop. i7 processor, 16GB RAM, 512GB SSD, GTX 1660Ti.",
  },
  {
    id: 4,
    image: "./guittter.jpg",
    name: "Guitar",
    price: "₹5,000",
    seller: "Meera Joshi",
    mobile: "6543210987",
    description: "Acoustic guitar with bag. Perfect for beginners.",
  },
  {
    id: 5,
    image: "./fridge.jpg",
    name: "Refrigerator",
    price: "₹8,000",
    seller: "Karan Malhotra",
    mobile: "5432109876",
    description: "190L single door refrigerator. 2 years old, working perfectly.",
  },
];

const SellPage = () => {
  const [contactVisible, setContactVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleContact = (id) => {
    setContactVisible(contactVisible === id ? null : id);
  };

  const filteredItems = sellItems.filter((item) =>
    [item.name, item.description, item.price, item.seller]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="sell-container">
      <div className="sell-header">
        <button onClick={() => navigate("/")} className="back-button">
          <ArrowLeft size={20} />
          {/* <span>Back to Home</span> */}
        </button>
        <h1>Items for Sale</h1>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search for items, prices, or sellers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Item Listing */}
      {filteredItems.length === 0 ? (
        <p className="no-items">No items match your search. Try a different term.</p>
      ) : (
        <div className="sell-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="sell-card">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="sell-image" />

              <div className="sell-info">
                <div className="sell-price">{item.price}</div>
                <div className="sell-seller">{item.seller}</div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                {contactVisible === item.id ? (
                  <div className="contact-info">
                    <h4>
                      <Phone size={18} /> Contact Seller
                    </h4>
                    <p><strong>Name:</strong> {item.seller}</p>
                    <p><strong>Phone:</strong> {item.mobile}</p>
                    <button onClick={() => toggleContact(item.id)} className="hide-contact">
                      Hide Contact
                    </button>
                  </div>
                ) : (
                  <button onClick={() => toggleContact(item.id)} className="contact-button">
                    Contact Seller
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellPage;
