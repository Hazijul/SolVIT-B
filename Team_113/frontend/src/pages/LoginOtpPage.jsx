import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function VerifyOtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  // const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    const jwtToken = localStorage.getItem("jwtToken");
    const region = localStorage.getItem("region");
    const role = localStorage.getItem("role");

    if (!jwtToken || !region || !role) {
      alert("Missing authentication data. Please log in again.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:2426/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwtToken,
          Region: region,
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        login(jwtToken, { email }, region);
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "OTP verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("An error occurred during verification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #e0ecff, #f9fafe)", padding: "20px" }}>
      <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)", maxWidth: "420px", width: "100%" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "700", textAlign: "center", color: "#1a1a1a", marginBottom: "20px" }}>Verify OTP</h2>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#555", marginBottom: "25px" }}>Enter the OTP sent to your email to continue</p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#333" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "10px", fontSize: "14px", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#333" }}>OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter 6-digit OTP"
              style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "10px", fontSize: "14px", outline: "none" }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              backgroundColor: isSubmitting ? "#a5b6d2" : "#0056d2",
              color: "#fff",
              padding: "12px",
              fontSize: "15px",
              fontWeight: "600",
              borderRadius: "10px",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#666" }}>
          Didn't receive an OTP? <button style={{ color: "#0056d2", fontWeight: "600", background: "none", border: "none", cursor: "pointer" }} onClick={() => alert("Resend OTP functionality coming soon!")}>Resend OTP</button>
        </p>
      </div>
    </div>
  );
}