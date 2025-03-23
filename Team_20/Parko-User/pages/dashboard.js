import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { ToastContainer } from "react-toastify";
import { Home, MapPin, Car, Settings, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import QRCode from 'react-qr-code';


const Dashboard = () => {

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [totalAmount, setTotalAmount] = useState(500); // Example amount
  const [orderId, setOrderId] = useState(""); // Order ID


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
const [filteredParking, setFilteredParking] = useState([]);
const [selectedParking, setSelectedParking] = useState(null);
const [parkingSpots, setParkingSpots] = useState([]); 
// You can filter the parking spots based on searchQuery, for example:
useEffect(() => {
  const filtered = parkingSpots.filter(spot => 
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFilteredParking(filtered);
}, [searchQuery]);
  const router = useRouter();
  const { data: session, status } = useSession();


  const [invoices, setInvoices] = useState([]); // To hold the invoices


  // Fetch invoices when the component mounts
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/invoices'); // Replace with your actual API endpoint
        const data = await response.json();
        setInvoices(data); // Set the fetched data to the invoices state
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Fetch parking data from MongoDB API
  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await fetch("/api/parking");
        const data = await response.json();
        setParkingSpots(data);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };

    fetchParkingData();
  }, []);

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredParking(parkingSpots);
    } else {
      const filtered = parkingSpots.filter((spot) =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (spot._id && spot._id.toString().includes(searchQuery))
      );
      setFilteredParking(filtered);
    }
  }, [searchQuery, parkingSpots]);


  // 🛠 FIXED: Hooks must be at the top level, before any conditional return
  const [activeTab, setActiveTab] = useState("home");
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    destination: "",
    days: "",
    notes: "",
  });
  const [parkingSubTab, setParkingSubTab] = useState("search");
  const [loading, setLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null); 

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/");
    }
  }, [session, status, router]);

  // ✅ FIXED: Hooks are initialized at the top, so we can return safely now
  if (!session) return null;

  const menuItems = [
    { name: "Home", icon: <Home size={24} />, key: "home" },
    { name: "Plan Trip", icon: <MapPin size={24} />, key: "plan" },
    { name: "Parking", icon: <Car size={24} />, key: "parking" },
    { name: "Settings", icon: <Settings size={24} />, key: "settings" },
  ];
  // Default sub-tab for parking
  const handlePlanSubmit = async () => {
    setLoading(true);
    setError("");
    setTravelPlan("");

    try {
      const response = await fetch("/api/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripDetails),
      });

      const data = await response.json();
      if (response.ok) {
        setTravelPlan(data.plan);
      } else {
        setError("Error fetching plan. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };
  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/travel-history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure session cookies are sent
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setHistory(data.history);
      } else {
        setError(data.error || "Error fetching history.");
      }
    } catch (error) {
      setError("Network error. Could not fetch history.");
    }
  };


  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK is not loaded. Please try again.");
      return;
    }

    // Call API to create an order with the amount and other details
    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalAmount, // You can replace this with the actual total
        currency: "INR",
      }),
    });

    const order = await res.json();

    if (!order.razorpayOrderId) {
      toast.error("Error creating Razorpay order");
      return;
    }

    // Razorpay options to open the checkout window
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID from environment
      amount: order.amount, // The order amount in paise
      currency: order.currency,
      order_id: order.razorpayOrderId, // The order ID returned by backend
      handler: async function (response) {
        toast.success("Payment Successful! Redirecting...");

        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userEmail: session.user.email, // Pass the orderId for further processing
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          toast.success("Payment Verified & Pass Generated");
          window.location.reload(); // Reload the page instead of redirecting
        } else {
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      theme: {
        color: "#3399cc", // Customize your color here
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };
  
  
  

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gray-800 p-6 space-y-6">
        <h2 className="text-2xl font-bold">Parko</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 w-full ${
                activeTab === item.key ? "bg-indigo-600" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}
              <span className="text-lg">{item.name}</span>
            </button>
          ))}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 p-3 text-red-400 hover:text-red-500 transition-all"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      <ToastContainer />
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Mobile Nav */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">PARKO</h2>
          <div className="flex gap-3">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`p-2 rounded-full ${
                  activeTab === item.key ? "bg-indigo-600" : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
         {activeTab === "home" && (
  <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold text-white">Welcome to Parko</h3>
    <p className="text-gray-400 mt-2">Plan your trips and manage parking easily.</p>

    {/* Responsive Image */}
    <div className="mt-6">
      <img
        src="/PARKO.jpg"  // Replace with your actual image path
        alt="Parko Illustration"
        className="w-full h-auto rounded-lg object-cover"
      />
    </div>

      {/* Notification Card */}
      <div className="mt-8 bg-gray-700 rounded-lg p-6 shadow-lg">
  <h4 className="text-xl font-semibold text-white">Notifications</h4>
  
  {/* Dummy Notifications */}
  <div className="mt-6 space-y-4">
    {/* Notification 1 */}
    <div className="flex items-start p-4 bg-gray-600 rounded-lg shadow-md hover:bg-gray-500 transition duration-300 ease-in-out">
      <div className="bg-blue-500 p-2 rounded-full text-white mr-4">
        <i className="fas fa-map-marker-alt"></i> {/* Map pin icon */}
      </div>
      <div>
        <p className="text-gray-300 text-sm">New parking location added near MP Nagar.</p>
        <span className="text-xs text-gray-500">Just now</span>
      </div>
    </div>

    {/* Notification 2 */}
    <div className="flex items-start p-4 bg-gray-600 rounded-lg shadow-md hover:bg-gray-500 transition duration-300 ease-in-out">
      <div className="bg-blue-500 p-2 rounded-full text-white mr-4">
        <i className="fas fa-map-marker-alt"></i> {/* Map pin icon */}
      </div>
      <div>
        <p className="text-gray-300 text-sm">New parking location added near Lalghati.</p>
        <span className="text-xs text-gray-500">10 mins ago</span>
      </div>
    </div>

    {/* Notification 3 */}
    <div className="flex items-start p-4 bg-gray-600 rounded-lg shadow-md hover:bg-gray-500 transition duration-300 ease-in-out">
      <div className="bg-blue-500 p-2 rounded-full text-white mr-4">
        <i className="fas fa-map-marker-alt"></i> {/* Map pin icon */}
      </div>
      <div>
        <p className="text-gray-300 text-sm">New parking location added near Misrod.</p>
        <span className="text-xs text-gray-500">30 mins ago</span>
      </div>
    </div>
  </div>
</div>
  </div>
)}


          {activeTab === "plan" && (
            <>
              <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold">Plan Your Trip</h3>
                <p className="text-gray-400 mt-2">
                  Find the best route and get real-time traffic updates.
                </p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => setShowPlanPopup(true)}
                    className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500"
                  >
                    Plan Travel
                  </button>
                  <button
  onClick={fetchHistory}
  className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
>
  Plan History
</button>


                </div>
              </div>

              {/* Destination Selection & Dropdown */}
              {history.length > 0 && (
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
                  <h3 className="text-xl font-semibold">Your Saved Travel Plans</h3>
                  
                  {/* Dropdown to Select Travel Plan */}
                  <select
                    className="mt-3 p-2 w-full bg-gray-700 rounded-lg text-white"
                    onChange={(e) => {
                      const selected = history.find(plan => plan._id === e.target.value);
                      setSelectedPlan(selected);
                    }}
                  >
                    <option value="">Select a plan...</option>
                    {history.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.destination} - {new Date(plan.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>

                  {/* Display Selected Travel Plan */}
                  {selectedPlan && (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg shadow-md">
                      <h4 className="text-lg font-semibold">Destination: {selectedPlan.destination}</h4>
                      <p><strong>Days:</strong> {selectedPlan.days}</p>
                      <p><strong>Notes:</strong> {selectedPlan.notes || "No notes"}</p>
                      <p><strong>Date:</strong> {new Date(selectedPlan.createdAt).toLocaleString()}</p>
                      <div
                        className="mt-2 text-gray-300 leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ __html: selectedPlan.planHtml }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Travel Plan Response Card */}
              {travelPlan && (
                <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
                  <h3 className="text-xl font-semibold mb-4">Your Travel Plan</h3>
                  <div
                    className="text-gray-300 leading-relaxed text-lg"
                    style={{ lineHeight: "2", letterSpacing: "0.5px" }}
                    dangerouslySetInnerHTML={{ __html: travelPlan }}
                  />
                </div>
              )}

              
            </>
          )}
{/* Parking Section */}
{activeTab === "parking" && (
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Parking System</h3>
              <p className="text-gray-400 mt-2">
                Search for parking, view invoices, and check history.
              </p>

              {/* Parking Submenu */}
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setParkingSubTab("search")}
                  className={`px-4 py-2 rounded-lg ${
                    parkingSubTab === "search" ? "bg-indigo-600" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Search
                </button>
                <button
                  onClick={() => setParkingSubTab("invoice")}
                  className={`px-4 py-2 rounded-lg ${
                    parkingSubTab === "invoice" ? "bg-indigo-600" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Invoice
                </button>
                <button
                  onClick={() => setParkingSubTab("history")}
                  className={`px-4 py-2 rounded-lg ${
                    parkingSubTab === "history" ? "bg-indigo-600" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  History
                </button>
              </div>

              {/* Parking Submenu Content */}
              <div className="mt-6">
              {parkingSubTab === "search" && (
  <div>
    <h4 className="text-lg font-semibold">Search for Parking</h4>
    <p className="text-gray-400 mt-2">Find available parking spots in your area.</p>

    {/* Search Box */}
    <input
      type="text"
      placeholder="Enter location or parking ID"
      className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />

    {/* Parking Results - Dropdown */}
    {searchQuery && (
      <div className="mt-4">
        {filteredParking.length > 0 ? (
          <div className="bg-gray-700 rounded-lg">
            <select
              className="w-full p-2 rounded bg-gray-600 text-white"
              onChange={(e) => setSelectedParking(filteredParking.find(spot => spot._id === e.target.value))}
            >
              <option value="">Select a parking spot</option>
              {filteredParking.map((spot, index) => (
                <option key={index} value={spot._id}>
                  {spot.name} - {spot.address}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-gray-400 mt-2">No matching parking spots found.</p>
        )}
      </div>
    )}

    {/* Display Selected Parking Details */}
    {selectedParking && (
      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
        <h5 className="text-lg font-semibold">{selectedParking.name}</h5>
        <p className="text-gray-400">{selectedParking.address}</p>
        <p className="text-gray-400">Latitude: {selectedParking.latitude}</p>
        <p className="text-gray-400">Longitude: {selectedParking.longitude}</p>
        <p className="text-gray-400">Available Slots: {selectedParking.available_slots}</p>
        <p className="text-gray-400">Total Slots: {selectedParking.total_slots}</p>
        <p className="text-gray-400">Price per Hour: ₹{selectedParking.price_per_hour}</p>
      </div>
    )}
  </div>
)}


{parkingSubTab === "invoice" && (
  <div>
    <h4 className="text-lg font-semibold text-white">Parking Invoices</h4>
    <p className="text-gray-400 mt-2">View and manage your parking invoices.</p>

    {/* Loading state */}
    {loading && <p className="text-gray-400">Loading invoices...</p>}

    {/* Display Invoices */}
    <div className="mt-4">
      {invoices.length > 0 ? (
        invoices.map((invoice) => (
          <div key={invoice._id} className="bg-gray-700 p-6 rounded-lg mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h5 className="text-xl font-semibold text-white">Invoice #{invoice._id}</h5>
            <p className="text-gray-400">Amount: ₹{invoice.amount}</p>
            <p className="text-gray-400">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-400">Status: {invoice.status}</p>

            {/* Parking Details */}
            <div className="mt-4">
              <p className="text-gray-400">Parking Location: {invoice.parkingDetails.parkingLocation}</p>
              <p className="text-gray-400">Start Time: {new Date(invoice.parkingDetails.startTime).toLocaleString()}</p>
              <p className="text-gray-400">End Time: {new Date(invoice.parkingDetails.endTime).toLocaleString()}</p>
            </div>

            {/* QR Code for Paid invoices */}
            {invoice.status === "Paid" && (
              <div className="mt-6 p-4 bg-white rounded-lg shadow-md flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <h6 className="text-gray-600 text-lg mb-2">Scan to Exit Parking</h6>
                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <QRCode value={invoice._id} size={160} />
                  </div>
                </div>
              </div>
            )}

            {/* Pay Now Button */}
            {invoice.status === "Pending" && (
              <button
                onClick={() => handlePayment(invoice._id)}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Pay Now
              </button>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No invoices found.</p>
      )}
    </div>
  </div>
)}


                {parkingSubTab === "history" && (
                  <div>
                    <h4 className="text-lg font-semibold">Parking History</h4>
                    <p className="text-gray-400 mt-2">Check your past parking records.</p>
                    {/* Add history fetching logic here */}
                  </div>
                )}
              </div>
            </div>
          )}

{activeTab === "settings" && (
  <div className="p-6 bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto relative overflow-hidden w-full md:max-w-lg lg:max-w-xl">
    {/* Background Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-75 blur-lg" />

    {/* User Profile */}
    <div className="relative z-10 flex flex-col items-center">
      <img
        src={session?.user?.image || "/default-avatar.png"} // Default avatar
        alt="User Avatar"
        className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-indigo-500 shadow-lg"
      />
      <h3 className="text-2xl font-semibold text-white mt-4 text-center">
        {session?.user?.name || "Guest User"}
      </h3>
      <p className="text-gray-400 text-sm">{session?.user?.email || "N/A"}</p>
    </div>

    {/* User Details */}
    <div className="relative z-10 mt-6 space-y-4 bg-gray-900/50 p-6 rounded-lg shadow-md text-gray-300 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <span className="text-indigo-400 text-lg font-medium">👤 Name:</span>
        <span className="text-white">{session?.user?.name || "N/A"}</span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <span className="text-indigo-400 text-lg font-medium">📧 Email:</span>
        <span className="text-white">{session?.user?.email || "N/A"}</span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <span className="text-indigo-400 text-lg font-medium">🎂 DOB:</span>
        <span className="text-white">{session?.user?.dob || "Not Available"}</span>
      </div>
    </div>

    {/* Logout Button */}
    <div className="relative z-10 mt-6 flex justify-center">
      <button
        onClick={() => signOut()}
        className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full transition-all shadow-lg w-full md:w-auto"
      >
        Logout 🚀
      </button>
    </div>
  </div>
)}

        </motion.div>
      </div>

      {/* Plan Travel Popup */}
      {showPlanPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Plan Your Trip</h3>
            <input
              type="text"
              placeholder="Destination"
              className="w-full p-2 mb-2 rounded bg-gray-700"
              onChange={(e) =>
                setTripDetails({ ...tripDetails, destination: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Days"
              className="w-full p-2 mb-2 rounded bg-gray-700"
              onChange={(e) => setTripDetails({ ...tripDetails, days: e.target.value })}
            />
            <textarea
              placeholder="Additional Notes"
              className="w-full p-2 mb-2 rounded bg-gray-700"
              onChange={(e) => setTripDetails({ ...tripDetails, notes: e.target.value })}
            ></textarea>
            <button
              onClick={handlePlanSubmit}
              className="w-full bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500"
            >
              {loading ? "Planning..." : "Get Plan"}
            </button>
            {error && <p className="mt-2 text-red-400">{error}</p>}
            <button onClick={() => setShowPlanPopup(false)} className="mt-2 text-red-400">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
