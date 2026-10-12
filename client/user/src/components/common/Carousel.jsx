import { useEffect, useState } from "react";

const Carousel = ({ slides, autoPlay = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // auto-advance, pauses on hover/focus
  useEffect(() => {
    if (!autoPlay || paused) return;
    const id = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      autoPlay
    );
    return () => clearInterval(id);
  }, [autoPlay, paused, slides.length]);

  return (
    <div
      className="relative w-full h-[260px] sm:h-[400px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== currentSlide}
        >
          <img
            src={slide}
            className="w-full h-full object-cover"
            alt={`Turf ${index + 1}`}
            loading="lazy"
          />
        </div>
      ))}

      <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
        <button
          onClick={prevSlide}
          className="btn btn-circle btn-sm sm:btn-md glass-panel border-none"
          aria-label="Previous slide"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="btn btn-circle btn-sm sm:btn-md glass-panel border-none"
          aria-label="Next slide"
        >
          ❯
        </button>
      </div>

      {/* dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === currentSlide ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
