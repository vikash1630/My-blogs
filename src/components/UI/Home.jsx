import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "./Footer";
import BlogsData from "../Blogs/BlogsData.json";
import BlogsDescription from "../Blogs/BlogsDescription.json";

const MAX_TOPICS = 6;

// build categories from BlogsData (image = first blog of that category)
const categories = [...new Set(BlogsData.map((b) => b.category))]
  .map((name) => {
    const blogs = BlogsData.filter((b) => b.category === name);
    const info = BlogsDescription.find((d) => d.category === name);
    return {
      name,
      count: blogs.length,
      image: blogs[0].image,
      description: info?.description || "",
      topics: info?.topics || [],
    };
  })
  .sort((a, b) => b.count - a.count);

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950/40 dark:via-gray-950 dark:to-cyan-950/30" />
        <div className="relative px-4 sm:px-6 lg:px-10 py-20 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Learn. Build.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Grow.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Simple, structured notes on DSA, Computer Networks, System Design
            and more.
          </p>
          <Link
            to="/blogs"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            All Blogs
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-10 py-14">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Browse by topic
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(
            ({ name, count, image, description, topics }) => (
              <Link
                key={name}
                to={`/category/${encodeURIComponent(name)}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/50"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {count} {count === 1 ? "blog" : "blogs"}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {name}
                    </h3>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowRight size={16} />
                    </span>
                  </div>

                  {description && (
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                  )}

                  {topics.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-1">
                      {topics.slice(0, MAX_TOPICS).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md bg-gray-100 dark:bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          {topic}
                        </span>
                      ))}
                      {topics.length > MAX_TOPICS && (
                        <span className="rounded-md bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                          +{topics.length - MAX_TOPICS} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;