import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/UI/NavBar"; // ✅ ADD THIS IMPORT
import Home from "./components/UI/Home";
import About from "./components/UI/About";
import Contact from "./components/UI/Contact";
import Blogs from "./components/Blogs/Blogs";

import "./App.css";

function App() {
  return (
    <Router>
      <NavBar /> {/* ✅ ADD THIS - Place it here, BEFORE Routes */}
      
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Blogs */}
        <Route path="/blogs" element={<Blogs />} />

        {/* About */}
        <Route path="/about" element={<About />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />



        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>

        <p className="mt-4 text-xl text-gray-600">
          Page Not Found
        </p>

        <a
          href="/"
          className="inline-block mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default App;