import { useState } from "react";
import { Star, Heart } from "lucide-react";

export default function MembershipPage() {
  const [plan, setPlan] = useState("monthly");

  const pricing = {
    monthly: { single: 199, team: 299 },
    yearly: { single: 1999, team: 2999 },
  };

  return (
    <div className="bg-brand-bg min-h-screen  transition-colors duration-300 py-6">

      <div className="px-10" >
        {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-brand-text py-6 mb-4">
        Become Member of Writora
      </h1>

      <p className="text-center text-[var(--color-brand-muted)] mb-8">
        Support writers and unlock premium features.
      </p>

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setPlan("monthly")}
          className={`px-6 py-2 rounded-full text-brand-text border transition cursor-pointer ${
            plan === "monthly"
              ? "bg-[var(--color-brand-muted)] text-white"
              : "border-[var(--color-brand-border)]"
          }`}
        >
          Pay Monthly
        </button>
        <button
          onClick={() => setPlan("yearly")}
          className={`px-6 py-2 rounded-full text-brand-text border transition cursor-pointer ${
            plan === "yearly"
              ? "bg-[var(--color-brand-muted)] text-white"
              : "border-[var(--color-brand-border)]"
          }`}
        >
          Pay Yearly
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8 px-20">
        {/* Single User */}
        <div className="relative p-10  rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-bg)] shadow-[var(--shadow-card)]">
          {/* Badge */}
          <div className="absolute top-4 right-4 bg-yellow-400 text-white p-2 rounded-full">
            <Star size={16} />
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>

          <h2 className="text-center text-brand-text text-xl font-semibold mt-4">Member</h2>

          <p className="text-center text-brand-text text-3xl font-bold mt-2">
            ₹{pricing[plan].single}
            <span className="text-sm text-[var(--color-brand-muted)]">
              /{plan}
            </span>
          </p>

          <p className="text-center text-[var(--color-brand-muted)] mt-4">
            {plan === "monthly"
              ? "Access member-only stories and enjoy an enhanced reading and writing experience. Cancel anytime."
              : "Contribute more to writers and strengthen your support for the Medium community. Cancel anytime."}
          </p>

          <button className="w-full mt-6 py-2 cursor-pointer rounded-lg bg-[var(--color-brand-green)] text-white hover:bg-[var(--color-brand-green-hover)] transition">
            Select Plan
          </button>

          <ul className="mt-6 space-y-2 text-sm text-[var(--color-brand-muted)]">
            <li>✔ Unlimited reading</li>
            <li>✔ Exclusive content</li>
            <li>✔ Support writers</li>
          </ul>
        </div>

        {/* Team Plan */}
        <div className="relative p-8 rounded-2xl border border-[var(--color-brand-border)] bg-[var(--color-brand-bg)] shadow-[var(--shadow-card)]">
          {/* Badge */}
          <div className="absolute top-4 right-4 bg-pink-500 text-white p-2 rounded-full">
            <Heart size={16} />
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>

          <h2 className="text-center text-brand-text text-xl font-semibold mt-4">
            With Friend
          </h2>

          <p className="text-center text-brand-text text-3xl font-bold mt-2">
            ₹{pricing[plan].team}
            <span className="text-sm text-[var(--color-brand-muted)]">
              /{plan}
            </span>
          </p>

          <p className="text-center text-[var(--color-brand-muted)] mt-4">
            {plan === "monthly"
              ? "Access member-only stories and enjoy an enhanced reading and writing experience. Cancel anytime."
              : "Contribute more to writers and strengthen your support for the Medium community. Cancel anytime."}
          </p>

          <button className="w-full mt-6 py-2 cursor-pointer rounded-lg bg-[var(--color-brand-green)] text-white hover:bg-[var(--color-brand-green-hover)] transition">
            Select Plan
          </button>

          <ul className="mt-6 space-y-2 text-sm text-[var(--color-brand-muted)]">
            <li>✔ 2 User Access</li>
            <li>✔ Shared benefits</li>
            <li>✔ Priority support</li>
          </ul>
        </div>
      </div>
      </div>

    </div>
  );
}
