import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { SocialButton } from "./SocialButton";
import { InputField } from "./InputField";
import { auth, googleProvider, db } from "../firebase/config";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
} from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        specialty: '',
        location: '',
        organization: '',
        AadharNumber: '',
        aadhar: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [userType, setUserType] = useState("patient");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const generateSearchKeywords = (name, specialty) => {
        const keywords = [];
        const nameKeywords = name.toLowerCase().split(" ");
        const specialtyKeywords = specialty.toLowerCase().split(" ");

        keywords.push(name.toLowerCase(), specialty.toLowerCase());
        keywords.push(...nameKeywords);
        keywords.push(...specialtyKeywords);

        return keywords;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, firstName, lastName, specialty, location, aadhar } = formData;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const name = `${firstName} ${lastName}`;
            let userData = {
                uid: user.uid,
                firstName,
                lastName,
                email,
                role: userType,
                createdAt: new Date(),
                aadhar
            };
            const handleSubmit = async (e) => {
                e.preventDefault();
                const { email, password, firstName, lastName, specialty, location } = formData;
                try {
                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );
                    const user = userCredential.user;

                    const name = `${firstName} ${lastName}`;

                    let userData = {
                        uid: user.uid,
                        firstName,
                        lastName,
                        email,
                        role: userType, // 'patient' or 'doctor'
                        createdAt: new Date(),
                    };

                    let collectionName = "patients";

                    if (userType === "doctor") {
                        collectionName = "doctors";
                        userData = {
                            ...userData,
                            specialty,
                            location,
                            name,
                            searchKeywords: generateSearchKeywords(name, specialty),
                        };
                    }

                    await setDoc(doc(db, collectionName, user.uid), userData);

                    console.log(
                        `${userType.charAt(0).toUpperCase() + userType.slice(1)} signed up:`,
                        user
                    );

                    if (userType === "doctor") {
                        navigate("/dashboard");
                    } else {
                        navigate("/");
                    }
                } catch (err) {
                    console.error(err);
                    setError(err.message);
                }
            };
        } catch (err) {
            console.error(err);
            setError(err.message);
        }

        return (
            <div className="min-h-screen flex text-left">
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h1 className="text-3xl font-bold mb-8">Create a free account as a </h1>

                        {/* Toggle User Type */}
                        <div className="flex mb-6">
                            <button
                                type="button"
                                className={`flex-1 py-3 rounded-l-lg font-medium transition-colors ${userType === "patient"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                                onClick={() => setUserType("patient")}
                            >
                                Patient
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-3 rounded-r-lg font-medium transition-colors ${userType === "doctor" ? "bg-blue-500 text-white" : "bg-gray-200"
                                    }`}
                                onClick={() => setUserType("doctor")}
                            >
                                Doctor
                            </button>
                        </div>

                        {/* Separator */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-gray-500 text-sm">OR</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        {/* Sign-Up Form */}
                        <form onSubmit={handleSubmit}>
                            <InputField
                                label="First Name"
                                placeholder="Alexa"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />

                            <InputField
                                label="Last Name"
                                placeholder="Mathew"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />

                            <InputField
                                label="Email Address"
                                type="email"
                                placeholder="abc@google.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <InputField
                                label="Password"
                                type="password"
                                placeholder="********"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />

                            {/* Additional Fields for Doctors */}
                            {
                                userType === "doctor" && (
                                    <>
                                        <InputField
                                            label="Specialty"
                                            placeholder="Cardiologist"
                                            name="specialty"
                                            value={formData.specialty}
                                            onChange={handleChange}
                                            required
                                        />

                                        <InputField
                                            label="Location"
                                            placeholder="New York"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                        />
                                    </>
                                )}

                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors mb-4"
                            >
                                {userType === "doctor"
                                    ? "Sign up as Doctor"
                                    : "Sign up as Patient"}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <p className="text-center text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div >
                </div >

                {/* Right Side - Welcome Message */}
                < div className="hidden lg:flex w-1/2 bg-gray-100 p-8 flex-col items-center justify-center" >
                    <div className="w-32 h-32 bg-gray-300 rounded-full mb-8"></div>
                    <h2 className="text-3xl font-bold mb-4">Welcome to Medi-Chain</h2>
                    <p className="text-gray-600 text-center max-w-md">
                        "Your health, your control – MediTrack simplifies care, secures your
                        records, and connects you to better healthcare anytime, anywhere."
                    </p>
                </div >
            </div >
        );
    }
};
