import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

const TurfCard = ({ turf }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const href = isLoggedIn ? `/auth/turf/${turf._id}` : `/turf/${turf._id}`;

  return (
    <Link
      to={href}
      className="group card bg-base-100 shadow-lg ring-1 ring-base-content/5 overflow-hidden animate-bounce-fade-in transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
    >
      <figure className="relative overflow-hidden">
        <img
          src={turf.image}
          alt={turf.name}
          loading="lazy"
          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute left-4 bottom-3 flex items-center gap-1 text-white text-xs font-medium bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
          <Clock size={12} />
          {turf.openTime} - {turf.closeTime}
        </span>
      </figure>
      <div className="card-body">
        <h2 className="card-title group-hover:text-primary transition-colors">
          {turf.name}
        </h2>
        <div className="flex flex-wrap gap-2">
          {turf.sportTypes.map((sport, index) => (
            <span
              key={index}
              className="badge badge-primary badge-outline"
            >
              {sport}
            </span>
          ))}
        </div>
        <div className="card-actions justify-end mt-3">
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            View Details
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TurfCard;
