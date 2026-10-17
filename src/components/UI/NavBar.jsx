import { Link, NavLink } from "react-router-dom";
import { Menu, X, Moon, Sun, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

const navLinks = [
  { name: "Blogs", path: "/blogs" },
  { name: "About Me", path: "/about" },
  { name: "Contact", path: "/contact" },
  {
    name: "Portfolio",
    path: "https://vikashportfolio-psi.vercel.app/",
    external: true,
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // apply theme whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  const closeMenu = () => setMenuOpen(false);

  const linkBase =
    "text-sm font-medium rounded-md transition-colors duration-200";
  const linkActive =
    "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10";
  const linkIdle =
    "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5";

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="flex h-16 w-full items-center gap-3 px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-sm">
              V
            </span>
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              Vikash
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkBase} ${linkIdle} flex items-center gap-1 px-3 py-2`}
                >
                  {link.name}
                  <ExternalLink size={13} />
                </a>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `${linkBase} px-3 py-2 ${isActive ? linkActive : linkIdle}`
                  }
                >
                  {link.name}
                </NavLink>
              )
            )}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-0 md:flex-none md:ml-auto md:w-72 lg:w-80">
            <SearchBar onSelect={closeMenu} />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={iconBtn}
            >
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className={`${iconBtn} md:hidden`}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-black/30 md:hidden"
            onClick={closeMenu}
          />

          <div
            className="fixed top-16 left-0 right-0 z-30 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 shadow-lg md:hidden"
            style={{ animation: "menuDown 0.2s ease-out" }}
          >
            <div className="flex flex-col gap-1 px-4 sm:px-6 py-3">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className={`${linkBase} ${linkIdle} flex items-center justify-between px-3 py-3`}
                  >
                    {link.name}
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `${linkBase} px-3 py-3 ${isActive ? linkActive : linkIdle}`
                    }
                  >
                    {link.name}
                  </NavLink>
                )
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes menuDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;