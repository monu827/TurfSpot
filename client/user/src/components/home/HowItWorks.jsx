import { Search, CalendarClock, PartyPopper } from "lucide-react";
import useReveal from "../../hooks/useReveal";

const steps = [
  { icon: Search, title: "Find a turf", text: "Browse turfs near you and check sports, timings and reviews." },
  { icon: CalendarClock, title: "Book a slot", text: "Select your date and time, then pay online in seconds." },
  { icon: PartyPopper, title: "Show up & play", text: "Scan your QR confirmation at the venue and start the game." },
];

const HowItWorks = () => {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal container mx-auto px-4 py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-primary font-semibold tracking-wide uppercase text-sm">How it works</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">From search to kick-off in 3 steps</h2>
      </div>

      <div className="relative grid md:grid-cols-3 gap-8">
        {/* connector line (desktop) */}
        <div className="hidden md:block absolute top-10 left-[16%] right-[16%] border-t-2 border-dashed border-primary/40" />
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            className="relative text-center group"
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="mx-auto relative grid place-items-center h-20 w-20 rounded-2xl bg-base-100 border border-primary/30 shadow-lg group-hover:-translate-y-1 group-hover:shadow-primary/30 transition">
              <Icon size={32} className="text-primary" />
              <span className="absolute -top-3 -right-3 h-7 w-7 grid place-items-center rounded-full bg-primary text-primary-content text-sm font-bold">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold">{title}</h3>
            <p className="mt-2 opacity-70 text-sm max-w-xs mx-auto">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
