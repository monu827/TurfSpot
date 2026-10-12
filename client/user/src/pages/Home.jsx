import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Carousel from "../components/common/Carousel";
import Footer from "../components/layout/Footer";
import useTurfData from "../hooks/useTurfData";
import TurfCard from "../components/turf/TurfCard";
import TurfCardSkeleton from "../components/ui/TurfCardSkeleton";
import Hero3D from "../components/home/Hero3D";
import Highlights from "../components/home/Highlights";
import HowItWorks from "../components/home/HowItWorks";
import CtaBanner from "../components/home/CtaBanner";
import useReveal from "../hooks/useReveal";
import { useSelector } from "react-redux";
import banner1 from "/banner-1.png";
import banner2 from "/banner-2.jpeg";
import banner3 from "/banner-3.jpeg";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { turfs, loading } = useTurfData();
  const slides = [banner1, banner2, banner3];
  const featuredRef = useReveal(0.1);
  const galleryRef = useReveal(0.1);

  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-x-hidden">
      {/* HERO */}
      <section className="hero-backdrop -mt-16 pb-20 pt-24 lg:pt-28">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center relative">
          <div className="animate-slide-in-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Book turfs online
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Your game. <br />
              Your turf. <span className="gradient-text">Your time.</span>
            </h1>
            <p className="mt-5 text-lg opacity-75 max-w-lg">
              Discover and book the best turf fields in your area. Whether
              you&#39;re planning a casual game or a tournament, TurfSpot has
              got you covered.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={isLoggedIn ? "/auth/turfs" : "/signup"}
                className="btn btn-primary btn-lg text-white shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link
                to={isLoggedIn ? "/auth/turfs" : "/turfs"}
                className="btn btn-lg btn-ghost border border-base-content/20"
              >
                Browse turfs
              </Link>
            </div>
            <p className="mt-6 text-xs opacity-50 hidden lg:block">
              Tip: move your mouse over the 3D turf to tilt it.
            </p>
          </div>

          <div className="animate-slide-in-right">
            <Hero3D fallbackImage={banner1} />
          </div>
        </div>
      </section>

      <Highlights />

      {/* FEATURED */}
      <section ref={featuredRef} className="reveal container mx-auto px-4 pt-16">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-primary font-semibold tracking-wide uppercase text-sm">
              Popular right now
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mt-1">Featured Turfs</h2>
          </div>
          <Link
            to={isLoggedIn ? "/auth/turfs" : "/turfs"}
            className="btn btn-ghost text-primary"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <TurfCardSkeleton key={`skeleton-${index}`} />
              ))
            : turfs
                .slice(0, 3)
                .map((turf) => <TurfCard key={turf._id} turf={turf} />)}
        </div>
      </section>

      <HowItWorks />

      {/* GALLERY */}
      <section ref={galleryRef} className="reveal container mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Inside the action
        </h2>
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-base-content/10">
          <Carousel slides={slides} />
        </div>
      </section>

      <CtaBanner isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
};

export default Home;
