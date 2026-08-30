import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* <NavBar /> */}

      <div className="w-full px-4 sm:px-6 lg:px-10 py-16">
        <div className="mx-auto max-w-3xl flex flex-col gap-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
              About Me
            </p>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Vikash Mundakar
            </h1>

            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              B.Tech CSE student at Mahatma Gandhi Institute of Technology
              (MGIT), Hyderabad — 2024 to 2028, GPA 9.1/10.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Major Skills
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              C, C++, Java, Python, JavaScript, React.js, Node.js, Express.js,
              Flask, MongoDB, MySQL, Tailwind CSS, Pandas, NumPy, Matplotlib,
              Git, GitHub, REST APIs, Socket.IO, JWT
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Projects
            </h2>

            <ul className="flex flex-col gap-2 text-lg text-gray-600 dark:text-gray-300 leading-relaxed list-disc list-inside">
              <li>
                <a
                  href="https://rail-pulse-5t74.vercel.app/"
                  className="font-semibold hover:underline text-gray-900 dark:text-white"
                >
                  Rail Pulse
                </a>{" "}
                — Flask, React.js, Pandas
              </li>
              <li>
                <a
                  href="https://local-lynk.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline text-gray-900 dark:text-white"
                >
                  Local Lynk
                </a>{" "}
                — React, Node.js, MongoDB, Socket.IO, JWT
              </li>
              
              <li>
                <a
                  href="https://frontendhackathon-olive.vercel.app/"
                  className="font-semibold hover:underline text-gray-900 dark:text-white"
                >
                  Churn Score Analytics Dashboard
                </a>{" "}
                —  Node.js, Express.js,  React.js
              </li>
              
              <li>
                <a
                  href="https://solo-levelling-fitness-model-app.onrender.com/"
                  className="font-semibold hover:underline text-gray-900 dark:text-white"
                >
                  Solo Leveling Fitness App
                </a>{" "}
                — Node.js, Express.js, MongoDB, SSR
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/vikash1630"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-5 py-2.5 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              🐙 GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/mundakar-vikash-0a8a6435b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold px-5 py-2.5 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              💼 LinkedIn
            </a>

            <a
              href="https://vikashportfolio-psi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold px-5 py-2.5 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              🌐 Portfolio
            </a>

            <a
              href="mailto:m.vikash1630@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold px-5 py-2.5 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              📧 Email
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
