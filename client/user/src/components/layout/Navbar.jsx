import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeSwitcher from "../common/ThemeSwitcher";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/turfs", label: "Turfs" },
];

const linkClass = ({ isActive }) =>
  `nav-link-anim rounded-lg font-medium ${isActive ? "active-link text-primary" : ""}`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`navbar fixed top-0 z-50 transition-all duration-300 animate-slide-in-top ${
        scrolled ? "glass-panel shadow-md py-1" : "bg-transparent py-2"
      }`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-ghost lg:hidden"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl glass-panel rounded-box w-52"
          >
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl gap-2 group">
          <img
            src="/logo.png"
            alt="TurfSpot"
            className="h-10 w-10 mask mask-squircle group-hover:rotate-12 transition-transform"
          />
          <span className="font-extrabold tracking-tight">
            Turf<span className="text-primary">Spot</span>
          </span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-1">
        <ThemeSwitcher />
        <Link to="/login" className="btn btn-primary btn-sm sm:btn-md text-white rounded-full px-6">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
