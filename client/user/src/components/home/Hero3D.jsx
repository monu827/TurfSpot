import { Suspense, lazy } from "react";

// three.js is only downloaded when the hero is rendered
const TurfScene = lazy(() => import("../three/TurfScene"));

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

const Hero3D = ({ fallbackImage }) => {
  const fallback = (
    <img
      src={fallbackImage}
      alt="Turf ground"
      className="w-full h-full object-cover rounded-3xl"
    />
  );

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[500px]">
      {/* glow behind the model */}
      <div className="absolute inset-6 rounded-full bg-primary/25 blur-3xl" />

      <div className="relative w-full h-full cursor-grab">
        {hasWebGL() ? (
          <Suspense
            fallback={
              <div className="w-full h-full grid place-items-center">
                <span className="loading loading-ring loading-lg text-primary" />
              </div>
            }
          >
            <TurfScene />
          </Suspense>
        ) : (
          fallback
        )}
      </div>

      {/* floating info chips */}
      <div className="glass-panel float-slow absolute top-4 left-2 sm:left-6 rounded-2xl px-4 py-2 text-sm shadow-lg">
        <span className="font-semibold">⚡ Instant booking</span>
      </div>
      <div
        className="glass-panel float-slow absolute bottom-6 right-2 sm:right-6 rounded-2xl px-4 py-2 text-sm shadow-lg"
        style={{ animationDelay: "1.2s" }}
      >
        <span className="font-semibold">🔒 Secure Razorpay payments</span>
      </div>
    </div>
  );
};

export default Hero3D;
