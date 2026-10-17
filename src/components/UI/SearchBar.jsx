import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import BlogsData from "../Blogs/BlogsData.json";

// highlight matched text
const Highlight = ({ text, query }) => {
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-blue-100 dark:bg-blue-500/30 text-inherit rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const q = query.trim();

  const results = q
    ? BlogsData.filter(
        (b) =>
          b.title.toLowerCase().includes(q.toLowerCase()) ||
          b.description.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  const handleSelect = () => {
    setQuery("");
    setOpen(false);
    if (onSelect) onSelect();
  };

  return (
    <div ref={ref} className="w-full md:relative">
      {/* Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search blogs..."
          className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-2 pl-9 pr-8 text-sm text-gray-900 dark:text-white placeholder-gray-500 transition-colors focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results */}
      {open && q && (
        <div className="absolute left-3 right-3 top-full mt-2 md:left-auto md:right-0 md:w-[28rem] overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-2xl z-50">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/10">
                {results.length} {results.length === 1 ? "result" : "results"}
              </div>

              <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
                {results.map((blog) => (
                  <li key={blog.id}>
                    <Link
                      to={`/blogs/${blog.id}`}
                      onClick={handleSelect}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <img
                        src={blog.image}
                        alt=""
                        className="h-12 w-16 flex-shrink-0 rounded-md object-cover bg-gray-100 dark:bg-gray-800"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          <Highlight text={blog.title} query={q} />
                        </h4>
                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                          {blog.description}
                        </p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="hidden sm:block flex-shrink-0 text-gray-300 dark:text-gray-600"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                to="/blogs"
                onClick={handleSelect}
                className="block border-t border-gray-100 dark:border-white/10 px-4 py-2.5 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                View all blogs
              </Link>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                No results found
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Try a different keyword
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;