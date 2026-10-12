import { Link } from "react-router-dom";
import useReveal from "../../hooks/useReveal";

const CtaBanner = ({ isLoggedIn }) => {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal container mx-auto px-4 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-500 to-lime-400 text-white p-8 md:p-14 text-center shadow-2xl">
        <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10" />
        <h2 className="relative text-3xl md:text-4xl font-extrabold">
          Ready for your next match?
        </h2>
        <p className="relative mt-3 max-w-xl mx-auto text-white/90">
          Lock in your slot before someone else does.
        </p>
        <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            to={isLoggedIn ? "/auth/turfs" : "/signup"}
            className="btn bg-white text-green-700 border-none hover:bg-white/90"
          >
            {isLoggedIn ? "Browse turfs" : "Create free account"}
          </Link>
          <Link to="/turfs" className="btn btn-outline text-white hover:bg-white/15 hover:border-white">
            Explore turfs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
