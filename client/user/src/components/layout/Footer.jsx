import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-content/10">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-center md:text-left">
        <div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <img src="/logo.png" alt="" className="h-9 w-9 mask mask-squircle" />
            <span className="text-xl font-extrabold">
              Turf<span className="text-primary">Spot</span>
            </span>
          </div>
          <p className="mt-3 text-sm opacity-70 max-w-xs mx-auto md:mx-0">
            Discover, book and play. The easiest way to reserve your turf.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Quick links</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              <Link className="hover:text-primary" to="/">Home</Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/turfs">Turfs</Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/login">Login</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} TurfSpot. All rights reserved.</p>
          <p className="mt-2">
            Developed with ❤ by{" "}
            <a
              href="https://github.com/monu827"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Monu Yadav
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
