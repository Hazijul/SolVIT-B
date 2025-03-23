// importing requirements
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import UrbanEye from '../../assets/Images/LOGO.png';

// defining client ID of Google Auth2.0
const clientId = "677130562489-hrvdg2tp2hlt7v0e7l2el986jdpng4cu.apps.googleusercontent.com"

// defining function
const SignUp = () =>{

    // initialize navigate by defining constant
    const navigate = useNavigate();

    // intialize the Hooks
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
      const [loading, setLoading] = useState(false);
    // defining the function of handle change 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    // defining the submit function of sign up
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
            if (response.status == 200) {
                console.log("auth token", response.data.token);
                localStorage.setItem('userId', response.data.token);
                navigate('/verifying');
            }
            setLoading(false);
        } catch (error) {
        console.error('Error Sign Up in', error);
        setError('Error signing up. Please try again later.');
        }
    }

    // defining the google auth function on sucess
    const HandleAuth = async (response) => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/google", { token: response.credential });
            localStorage.setItem("token", res.data.token); // Store JWT token
            navigate("/dashboard")
        } catch (error) {
            console.error("Auth failed", error);
        }
    }

    const handleLogIn = () => {
        navigate('/login');
      }

    return(
        <section id="login">
      <div className="login-container">
        <div className="logo-heading">
          <img src={UrbanEye} className="logo" alt="Logo" />
          <h2 className="section-heading">Sign Up</h2>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            required
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <button type="submit" className={loading ? "loading" : ""} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          {error && <p className="error">{error}</p>}
        
            {/* Sign Up with Google */}
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
          Already have an account? <a onClick={handleLogIn} style={{cursor: 'pointer'}}>Login here</a>
        </p>
      </div>
    </section>
    )
}

export default SignUp;