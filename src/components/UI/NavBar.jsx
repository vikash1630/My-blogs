import { Link, NavLink } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
    setMounted(true);
  }, []);

  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    if (themeValue === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.colorScheme = themeValue;
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const navLinks = [
    { name: "Blogs", path: "/blogs" },
    { name: "About Me", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Portfolio", path: "https://vikashportfolio-psi.vercel.app/", external: true },
  ];

  if (!mounted) return null;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-950/95 transition-colors duration-300">
        {/* Full width, small consistent side padding — no max-w container eating space */}
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
          
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-all duration-300 flex-shrink-0"
          >
            <div className="relative">
              <span className="block">Vikash</span>
              <span className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-2xl font-light animate-pulse">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-gray-900 dark:hover:text-white group"
                >
                  {link.name}
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                </a>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-sm font-medium transition-colors duration-300 group ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                >
                  {link.name}
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                </NavLink>
              )
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            >
              {theme === "light" ? (
                <Sun size={20} className="text-yellow-500" strokeWidth={2.5} />
              ) : (
                <Moon size={20} className="text-indigo-300" strokeWidth={2.5} />
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu size={20} className={`absolute transition-all duration-300 ${menuOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"}`} />
                <X size={20} className={`absolute transition-all duration-300 ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />

          <div
            className="fixed top-16 left-0 right-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/50 md:hidden"
            style={{ animation: "slideDown 0.3s ease-out" }}
          >
            <div className="w-full px-4 sm:px-6 py-3">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  link.external ? (
                    <a
                      key={link.name}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleNavClick}
                      className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 relative group"
                      style={{ animation: menuOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : "none" }}
                    >
                      {link.name}
                      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                    </a>
                  ) : (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`
                      }
                      style={{ animation: menuOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : "none" }}
                    >
                      {link.name}
                      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                    </NavLink>
                  )
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;