import React from 'react';
import chaturath from '../assets/chaturath.jpg';
import helpage from '../assets/helpage.png';
import swasth from '../assets/swasth.jpg';
import Antara from '../assets/antara.jpg'

const NGO = () => {
  return (
    <>

      {/* Main Content */}
      <main className="pt-16">
        {/* Banner */}
        <section
          id="home"
          className="text-center py-32 bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800"
        >
          <img src="/NGO.png" alt="NGO" className="mx-auto h-32 w-32" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Non-Governmental Organizations
          </h1>
          <p className="text-2xl mb-8">Empowering Lives, One Step at a Time</p>
          <a
            href="#about"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md transition"
          >
            Learn More
          </a>
        </section>

        {/* Timeline */}
        <section className="relative max-w-6xl mx-auto py-20">
          {/* Vertical Line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-green-500"></div>

          {/* First Entry (Left) */}
          <div className="container relative w-1/2 pr-8 py-10">
            <div className="absolute top-10 right-[-10px] w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
            <div className="bg-gray-100 hover:bg-blue-50 p-6 rounded-lg transition">
              <div className="mb-4">
                <img
                  src={helpage}
                  alt="HelpAge India"
                  className="h-32 w-32 mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold text-blue-500 mb-2 text-center">
                HelpAge India
              </h2>
              <p className="text-gray-700 mb-4">
                Setup in 1978. Let’s help transform elder lives. Join us in creating a society where
                our elders can enjoy an active, healthy, and dignified life.
              </p>
              <a
                href="https://www.helpageindia.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Click Here to Know More
              </a>
            </div>
          </div>

          {/* Second Entry (Right) */}
          <div className="container relative w-1/2 ml-auto pl-8 py-10">
            <div className="absolute top-10 left-[-10px] w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
            <div className="bg-gray-100 hover:bg-blue-50 p-6 rounded-lg transition">
              <div className="mb-4">
                <img
                  src={Antara}
                  alt="Antara Foundation"
                  className="h-24 w-36 mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold text-blue-500 mb-2 text-center">
                Antara Foundation
              </h2>
              <p className="text-gray-700 mb-4">
                To support the public health system deliver solutions at scale to improve maternal
                and child health outcomes, by partnering with government and communities.
              </p>
              <a
                href="https://antarafoundation.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Click Here to Know More
              </a>
            </div>
          </div>

          {/* Third Entry (Left) */}
          <div className="container relative w-1/2 pr-8 py-10">
            <div className="absolute top-10 right-[-10px] w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
            <div className="bg-gray-100 hover:bg-blue-50 p-6 rounded-lg transition">
              <div className="mb-4">
                <img
                  src={swasth}
                  alt="Swasth Foundation"
                  className="h-24 w-48 mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold text-blue-500 mb-2 text-center">
                Swasth Foundation
              </h2>
              <p className="text-gray-700 mb-4">
                We envision a world where the entire ecosystem of people and institutions in our
                lives support us to achieve sustained wellbeing and live a life of health and joy.
              </p>
              <a
                href="https://www.swasth.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Click Here to Know More
              </a>
            </div>
          </div>

          {/* Fourth Entry (Right) */}
          <div className="container relative w-1/2 ml-auto pl-8 py-10">
            <div className="absolute top-10 left-[-10px] w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
            <div className="bg-gray-100 hover:bg-blue-50 p-6 rounded-lg transition">
              <img
                src={chaturath}
                alt="Swasth Foundation"
                className="h-26 w-48 mx-auto"
              />

              <h2 className="text-2xl font-bold text-blue-500 mb-2 text-center">
                Charutar Arogya Mandal
              </h2>
              <p className="text-gray-700 mb-4">
                The Charutar Arogya Mandal was formed in 1972 as a trust and society to demonstrate
                how a rural community’s health care needs could be met. It is an outcome of a dream
                cherished by the late Dr. H M Patel, former Union Finance and Home Minister.
              </p>
              <a
                href="https://www.charutarhealth.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Click Here to Know More
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-800 py-10 text-center">
        <div className="footer-content max-w-xl mx-auto">
          <p>Follow us on:</p>
          <ul className="flex justify-center items-center gap-6 my-4 text-blue-500">
            <li>
              <a href="#" className="text-2xl hover:text-blue-600 transition">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li>
              <a
                href="https://x.com/akshat_srii"
                className="text-2xl hover:text-blue-600 transition"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/pranav-chaturvedi-a961a12ba/"
                className="text-2xl hover:text-blue-600 transition"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </li>
          </ul>
          <p className="mb-4">&copy; 2024 MediTrack. All rights reserved.</p>
          <form action="#" method="post" className="flex flex-col items-center gap-4">
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              className="px-4 py-2 w-64 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </footer>
    </>
  );
};

export default NGO;