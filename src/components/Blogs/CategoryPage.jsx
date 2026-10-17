import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../UI/Footer";
import BlogsData from "./BlogsData.json";

const CategoryPage = () => {
  const { category } = useParams();
  const blogs = BlogsData.filter((b) => b.category === category);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="mt-4 mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          {category}
        </h1>

        {blogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.id}`}
                className="flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="w-full aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {blog.title}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {blog.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;