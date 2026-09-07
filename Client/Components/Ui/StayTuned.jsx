import { Mail } from "lucide-react";
import MembershipInput from "./MembershipInput";

import { useState } from "react";

export default function StayTuned({ value  , onChange , onHandleSubscribe }) {

  const [ email , setEmail ] = useState("");

  return (
    <section className="max-w-5xl mx-auto px-4 py-24 border-t border-brand-border mt-10">
      <div className=" rounded-[1rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-brand-border shadow-sm">
        
        {/* Left Side: Content */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Mail className="w-4 h-4" /> Newsletter
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-brand-text tracking-tight">
            Stay Tuned <span className="text-brand-accent">.</span>
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed max-w-md">
            Join 5,000+ readers. Get the latest stories and membership perks 
            delivered straight to your inbox.
          </p>
        </div>

        {/* Right Side: Subscription Input */}
        <div className="flex-1 w-full max-w-md">
          <div className="space-y-3">
            <MembershipInput value={value}  onChange={onChange} onHandleSubscribe={onHandleSubscribe}  />
            <p className="text-[10px] text-brand-muted text-center md:text-left px-2">
              By subscribing, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
