import { CalendarCheck, CreditCard, QrCode, Star } from "lucide-react";
import useReveal from "../../hooks/useReveal";

const items = [
  { icon: CalendarCheck, title: "Pick any slot", text: "Choose date, time and duration in a few taps." },
  { icon: CreditCard, title: "Pay securely", text: "Checkout is handled by Razorpay." },
  { icon: QrCode, title: "QR confirmation", text: "Booking details land in your inbox with a QR code." },
  { icon: Star, title: "Rate & review", text: "Share feedback after you play." },
];

const Highlights = () => {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal container mx-auto px-4 -mt-10 relative z-10">
      <div className="glass-panel rounded-3xl shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="shrink-0 grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary">
              <Icon size={22} />
            </div>
            <div>
              <h3 className="font-semibold leading-tight">{title}</h3>
              <p className="text-sm opacity-70 mt-1">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Highlights;
