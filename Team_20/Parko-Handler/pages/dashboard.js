import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("scanPass");
  const [scanData, setScanData] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStyle, setModalStyle] = useState("bg-white"); // Default to white
  const [isScannerActive, setIsScannerActive] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  const sendDataToAPI = async (data) => {
    try {
      const response = await fetch("/api/verify-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passCode: data }),
      });
      const result = await response.json();
      setResponseMessage(result.message);
      setModalStyle(result.message.includes("Invalid") ? "bg-red-500" : "bg-green-500"); // Set modal color based on response
      setShowModal(true);
    } catch (error) {
      console.error("Error sending data:", error);
      setResponseMessage("Error communicating with the server.");
      setModalStyle("bg-red-500"); // In case of an error, show red modal
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (isScannerActive) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: 250,
      });

      scanner.render(onScanSuccess, onScanError);

      function onScanSuccess(decodedText) {
        setScanData(decodedText);
        sendDataToAPI(decodedText);
        setIsScannerActive(false); // Stop scanning after success
      }

      function onScanError(error) {
        console.error(error);
      }

      return () => scanner.clear();
    }
  }, [isScannerActive]);

  const handleScanClick = () => {
    setIsScannerActive(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <header className="p-4 bg-black bg-opacity-80 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-wide">Parking Handler</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </header>

      <main className="flex-grow p-6 flex justify-center items-center">
        {activeSection === "scanPass" ? (
          <div className="bg-gray-800 bg-opacity-70 p-6 rounded-3xl shadow-2xl text-center w-full max-w-md transform transition duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">Scan Parking Pass</h2>
            <button
              onClick={handleScanClick}
              className="w-full py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Open Camera to Scan QR Code
            </button>
            {isScannerActive && (
              <div
                id="reader"
                className="mx-auto w-full max-w-sm bg-gray-700 p-6 rounded-lg shadow-lg mt-4"
              ></div>
            )}
            {scanData && (
              <p className="text-lg mt-4 bg-black bg-opacity-50 p-2 rounded-md">
                Scanned: {scanData}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 bg-opacity-70 p-6 rounded-3xl shadow-2xl w-full max-w-md transform transition duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold text-center mb-4">Add Vehicle</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-300"
              />
              <input
                type="text"
                placeholder="Vehicle Number"
                className="w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-300"
              />
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 p-4 rounded-full shadow-xl flex space-x-6">
        <button
          onClick={() => setActiveSection("scanPass")}
          className={`px-4 py-2 text-xl rounded-full ${
            activeSection === "scanPass"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:text-blue-400"
          } transition duration-300`}
        >
          <i className="fas fa-qrcode"></i> Scan
        </button>
        <button
          onClick={() => setActiveSection("addVehicle")}
          className={`px-4 py-2 text-xl rounded-full ${
            activeSection === "addVehicle"
              ? "bg-green-600 text-white"
              : "text-gray-300 hover:text-green-400"
          } transition duration-300`}
        >
          <i className="fas fa-car"></i> Add
        </button>
      </footer>

      {/* Modal for API response */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`p-8 rounded-lg shadow-lg w-80 ${modalStyle}`}>
            <h3 className="text-xl font-semibold mb-4">API Response</h3>
            <p>{responseMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
