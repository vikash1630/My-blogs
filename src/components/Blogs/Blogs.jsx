import React, { useEffect, useState, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../UI/Footer";
import BlogsData from "./BlogsData.json";
import DsaCheatSheet from "./DataStructures/DsaCheatSheet";
import Part1 from "./ComputerNetworks/Part1";
import Part2 from "./ComputerNetworks/Part2";
import Part3 from "./ComputerNetworks/Part3";
import Part4 from "./ComputerNetworks/Part4";
import Part5 from "./ComputerNetworks/Part5";
// Add Blog url

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [ActiveComponent, setActiveComponent] = useState(null);
  const location = useLocation();

  const BLOG_COMPONENTS = {
    "dsa-cheatsheet": DsaCheatSheet,
    "CN-part-1": Part1,
    "CN-part-2": Part2,
    "CN-part-3": Part3,
    "CN-part-4": Part4,
    "CN-part-5": Part5,
    // Connect here
  };

  useEffect(() => {
    setBlogs(BlogsData);
  }, []);

  useEffect(() => {
    setActiveComponent(null);
  }, [location.key]);


  const handleView = (id) => {
    const Component = BLOG_COMPONENTS[id];
    setActiveComponent(() => Component);
  };

  if (ActiveComponent) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <button
            onClick={() => setActiveComponent(null)}
            className="mb-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-5 py-2 text-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            ← Back to Blogs
          </button>
          <Suspense
            fallback={
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            }
          >
            <ActiveComponent />
          </Suspense>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* <Navbar /> */}

      <div className="w-full px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => handleView(blog.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleView(blog.id)}
              className="flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="w-full aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 p-5 flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  {blog.title}
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                  {blog.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Blogs;
