import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    contactNumber: "",
    businessName: "",
    email: "",
    password: "",
    region: "",
    userType: "Buyer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      full_name: formData.fullName,
      email: formData.email,
      contact_number: formData.contactNumber,
      region: formData.region,
      password: formData.password,
    };

    try {
      const response = await axios.post("http://localhost:2426/student/register", body, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardWrapper}>
        <div style={styles.headerSection}>
          <h2 style={styles.heading}>Create Your Account</h2>
          <p style={styles.subText}>Start managing your inventories like a pro!</p>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={styles.input} placeholder="e.g. John Doe" required />
          </div>

          <div style={styles.flexRow}>
            <div style={{ ...styles.inputGroup, marginRight: "10px" }}>
              <label style={styles.label}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={styles.select} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Region</label>
              <select name="region" value={formData.region} onChange={handleChange} style={styles.select} required>
                <option value="">Select</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contact Number</label>
            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} style={styles.input} placeholder="e.g. +91 98765XXXXX" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Business Name</label>
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} style={styles.input} placeholder="e.g. ABC Traders" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="example@email.com" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} style={styles.input} placeholder="Choose a strong password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.button, ...(loading ? styles.disabledButton : {}) }}>
            {loading ? "Signing Up..." : "Register Now"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already registered?
          <a href="/login" style={styles.loginLink}> Login here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f2f7ff, #dce3f0)",
    padding: "20px",
  },
  cardWrapper: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "600px",
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "25px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
  },
  subText: {
    fontSize: "14px",
    color: "#777",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: "18px",
  },
  label: {
    fontSize: "14px",
    marginBottom: "6px",
    color: "#333",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "14px",
    transition: "border 0.3s ease",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  passwordWrapper: {
    position: "relative",
  },
  toggleButton: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    backgroundColor: "#0056d2",
    color: "white",
    padding: "14px",
    fontSize: "16px",
    fontWeight: 600,
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  disabledButton: {
    backgroundColor: "#a5b6d2",
    cursor: "not-allowed",
  },
  loginText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  },
  loginLink: {
    color: "#0056d2",
    textDecoration: "none",
    fontWeight: 600,
    marginLeft: "6px",
  },
  error: {
    backgroundColor: "#ffe0e0",
    color: "#d8000c",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center",
  },
  flexRow: {
    display: "flex",
    justifyContent: "space-between",
  },
};
