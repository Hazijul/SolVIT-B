import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    region: "north",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:2426/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("region", formData.region);

      navigate("/verifyotp");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Full Image */}
      <div style={styles.leftContainer}>
        <img src="/images/login-bg.jpg" alt="Login Background" style={styles.image} />
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.rightContainer}>
        <div style={styles.card}>
          <h2 style={styles.title}>Login</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Region</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                style={styles.select}
              >
                {["north", "south", "east", "west"].map((region) => (
                  <option key={region} value={region}>
                    {region.charAt(0).toUpperCase() + region.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <a href="/SignUp" style={styles.link}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
  },
  leftContainer: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: "30px",
    borderBottomLeftRadius: "30px",
    width: "50%", 
  },
  image: {
    width: "100%",
    //height: "100%",
    objectFit: "cover",
  },
  rightContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    
    // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  card: {
    padding: "30px",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "20px",
    color: "#1f2937",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#374151",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "10px",
  },
  footerText: {
    textAlign: "center",
    fontSize: "14px",
    marginTop: "15px",
    color: "#6b7280",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "500",
    textDecoration: "none",
  },
};