import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'
import UrbanEye from '../../assets/Images/LOGO.png';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = "677130562489-hrvdg2tp2hlt7v0e7l2el986jdpng4cu.apps.googleusercontent.com"

const LogIn = () =>{
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      const handleSignUp = () => {
        navigate('/signup');
      }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            console.log(response);
            if (response.status == 200) {
                localStorage.setItem("userId", response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
        console.error('Error Sign Up in', error);
        setError('Error signing up. Please try again later.');
        }
        setLoading(false);
    }

        // defining the google auth function on sucess
        const HandleAuth = async (response) => {
            try {
                const res = await axios.post("http://localhost:5000/api/auth/google", { token: response.credential });
                localStorage.setItem("userId", res.data.token); // Store JWT token
                navigate("/dashboard")
            } catch (error) {
                console.error("Auth failed", error);
            }
        }

    return(
        <section id="login">
      <div className="login-container">
        <div className="logo-heading">
          <img src={UrbanEye} className="logo" alt="Logo" />
          <h2 className="section-heading">Login</h2>
        </div>

        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className={`submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        {/* Sign In with Google */}
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                cookiePolicy={"single_host_origin"}
                onSuccess={HandleAuth}
                onError={() => {
                setError("Sign in with Google Failed, Please try again later");
                }}
                isSignedIn={true}
            />
        </GoogleOAuthProvider>
        </form>

        <p className="signup-text">
          Don't have an account? <a onClick={handleSignUp} style={{cursor: 'pointer'}}>Sign up here</a>
        </p>
      </div>
    </section>

    )
}

export default LogIn;