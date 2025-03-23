import { useState, useRef, useEffect } from "react";
import "./OTPInput.css";
import { useNavigate } from 'react-router-dom';

const OTPInput = ({ length = 6, onSubmit }) => {
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('userId');
    console.log(user);
    setUser(user);
  }, []);

  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").split("").slice(0, length);
    setOtp([...pasteData, ...new Array(length - pasteData.length).fill("")]);
    inputRefs.current[pasteData.length - 1]?.focus();
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user,
          otp: otp.join(""),
        }),
      });
  
      const data = await response.json();
  
      if (response.status == 200) {
        alert("OTP verified successfully!");
        navigate("/dashboard")
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-image-container">
        <img src='/src/assets/Images/OTP-IMAGE.jpg'/>
      </div>
      <div className="otp-container">
        <p style={{fontSize: '24px', fontWeight: 'bolder', marginTop: '-10px'}}>OTP Verification</p>
        <p style={{fontSize: '16px', marginTop: '-10px', marginBottom: '20px'}}>Enter otp code sent to you</p>
        <div className="otp-input-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="otp-input"
          />
        ))}
        </div>
        <button onClick={handleVerifyOTP} className="otp-button">
          Verify & Proceed
        </button>
      </div>

    </div>
  );
};

export default OTPInput;