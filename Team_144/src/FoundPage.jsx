import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import "./FoundPage.css";

const FoundPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    details: "",
    address: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Item reported as found! Thank you for your help.");
    setFormData({
      name: "",
      mobile: "",
      details: "",
      address: "",
    });
    setImagePreview(null);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="header">
          <button onClick={() => navigate("/")} className="back-link">
            <ArrowLeft className="icon" size={20} />
            {/* <span>Back to Home</span> */}
          </button>
          <h1 className="header-title">Report Found Item</h1>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            {/* Image Upload */}
            <div className="input-group">
              <label className="input-label">Upload Image</label>
              <div className="image-upload">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="upload-box">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  ) : (
                    <Upload size={48} className="upload-icon" />
                  )}
                  <span className="upload-text">{imagePreview ? "Change Image" : "Click to upload an image"}</span>
                </label>
              </div>
            </div>

            {/* Input Fields */}
            {[
              { id: "name", label: "Your Name", type: "text", placeholder: "Enter your full name" },
              { id: "mobile", label: "Mobile Number", type: "tel", placeholder: "Enter your contact number" },
            ].map((field) => (
              <div className="input-group" key={field.id}>
                <label htmlFor={field.id} className="input-label">{field.label}</label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {[
              { id: "details", label: "Item Details", placeholder: "Describe the item you found (color, brand, condition, etc.)" },
              { id: "address", label: "Where Found", placeholder: "Provide the location where you found this item" },
            ].map((field) => (
              <div className="input-group" key={field.id}>
                <label htmlFor={field.id} className="input-label">{field.label}</label>
                <textarea
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder={field.placeholder}
                ></textarea>
              </div>
            ))}

            {/* Buttons */}
            <div className="button-group">
              <button type="submit" className="submit-btn">Submit</button>
              <button type="button" className="back-btn" onClick={() => navigate("/")}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoundPage;
