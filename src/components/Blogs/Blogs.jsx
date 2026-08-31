import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../UI/Footer";
import BlogsData from "./BlogsData.json";

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setBlogs(BlogsData);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blogs/${blog.id}`}
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
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Blogs;