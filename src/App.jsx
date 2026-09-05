import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/UI/NavBar";
import Home from "./components/UI/Home";
import About from "./components/UI/About";
import Contact from "./components/UI/Contact";
import Blogs from "./components/Blogs/Blogs";

import DsaCheatSheet from "./components/Blogs/DataStructures/DsaCheatSheet";
import Part1 from "./components/Blogs/ComputerNetworks/Part1";
import Part2 from "./components/Blogs/ComputerNetworks/Part2";
import Part3 from "./components/Blogs/ComputerNetworks/Part3";
import Part4 from "./components/Blogs/ComputerNetworks/Part4";
import Part5 from "./components/Blogs/ComputerNetworks/Part5";

// Just import new files here and put it in router in App function and then add in BlogsData.json

import "./App.css";
import React1 from "./components/Blogs/React/React1";
import SystemDesign1 from "./components/Blogs/SystemDesign/SystemDesign1";
import SystemDesign2_OOPS from "./components/Blogs/SystemDesign/SystemDesign2_OOPS";
import OOP1 from "./components/Blogs/ObjectOrientedProgramming/OOP1";
import SystemDesign3 from "./components/Blogs/SystemDesign/SystemDesign3";
import ScrollToTop from "./components/UI/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/blogs" element={<Blogs />} />

        {/* Dsa */}
        <Route path="/blogs/dsa-cheatsheet" element={<DsaCheatSheet />} />

        {/* Computer Networks */}
        <Route path="/blogs/CN-part-1" element={<Part1 />} />
        <Route path="/blogs/CN-part-2" element={<Part2 />} />
        <Route path="/blogs/CN-part-3" element={<Part3 />} />
        <Route path="/blogs/CN-part-4" element={<Part4 />} />
        <Route path="/blogs/CN-part-5" element={<Part5 />} />

        {/* React */}
        <Route path="/blogs/React" element={<React1 />} />

        {/* OOPs */}
        <Route path="/blogs/OOPS" element={<OOP1 />} />

        {/* System Design */}
        <Route path="/blogs/SystemDesign-part-1" element={<SystemDesign1 />} />
        <Route
          path="/blogs/SystemDesign-part-2-OOPS"
          element={<SystemDesign2_OOPS />}
        />
        <Route path="/blogs/SystemDesign-part-3" element={<SystemDesign3 />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

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

        <p className="mt-4 text-xl text-gray-600">Page Not Found</p>

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
