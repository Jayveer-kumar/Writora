import { PenTool, Globe, Zap, Users } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <PenTool className="w-6 h-6 text-brand-accent" />,
      title: "Write Freely",
      desc: "A clean, distraction-free editor designed for your best thoughts."
    },
    {
      icon: <Globe className="w-6 h-6 text-brand-green" />,
      title: "Global Reach",
      desc: "Share your stories with a worldwide audience of curious readers."
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      title: "Community",
      desc: "Connect with other writers and grow your network every day."
    }
  ];

  return (
    <section className="py-20  border-brand-border mt-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-text mb-4 tracking-tight">
            Elevate your writing journey.
          </h2>
          <p className="text-brand-muted max-w-xl mx-auto">
            Writora provides the tools you need to publish, grow, and inspire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-surface rounded-3xl border border-brand-border hover:shadow-lg transition-all group">
              <div className="mb-4 p-3  w-fit rounded-2xl group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-2">{f.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Final CTA Button */}
        <div className="mt-16 text-center">
          <button className="bg-brand-text text-brand-bg px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-xl cursor-pointer ">
            Start Writing for Free
          </button>
        </div>
      </div>
    </section>
  );
}
