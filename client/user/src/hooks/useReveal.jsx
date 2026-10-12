import { useEffect, useRef } from "react";

// Adds the "is-visible" class when the element scrolls into view.
// Pair with the .reveal class defined in index.css.
const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return ref;
};

export default useReveal;
