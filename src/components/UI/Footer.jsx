import { Link } from "react-router-dom";
import { Code2, FolderGit2, Mail, SquareArrowOutUpRight } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const siteLinks = [
    { name: "Blogs", path: "/blogs" },
    { name: "About Me", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const codingProfiles = [
    { name: "GitHub", url: "https://github.com/vikash1630", icon: FolderGit2 },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/mundakar-vikash-0a8a6435b/", icon: SquareArrowOutUpRight },
    { name: "LeetCode", url: "https://leetcode.com/u/Vikash1630/", icon: Code2 },
    { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/profile/mvikask6kb?tab=activity", icon: Code2 },
  ];

  return (
    <footer className="w-full border-t border-gray-200 bg-white dark:border-gray-700/50 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand / Signature block */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="group inline-flex items-center gap-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              <span>Vikash</span>
              <span className="text-blue-600 dark:text-blue-400 text-2xl font-light">.</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              CS undergrad at MGIT, Hyderabad, writing about what I build and break along the way — React, Node, and the odd 2am bug fix.
            </p>
            <a
              href="mailto:m.vikash1630@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <Mail size={15} strokeWidth={2.5} />
              m.vikash1630@gmail.com
            </a>
          </div>

          {/* Site navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Site
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {siteLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://vikashportfolio-psi.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                >
                  Portfolio
                  <SquareArrowOutUpRight size={12} strokeWidth={2.5} />
                </a>
              </li>
            </ul>
          </div>

          {/* Coding profiles */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Elsewhere
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {codingProfiles.map((profile) => {
                const Icon = profile.icon;
                return (
                  <li key={profile.name}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                    >
                      <Icon size={15} strokeWidth={2.5} className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                      {profile.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col-reverse items-center gap-4 border-t border-gray-200 dark:border-gray-700/50 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {year} Vikash Mundakar. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Built with React &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;