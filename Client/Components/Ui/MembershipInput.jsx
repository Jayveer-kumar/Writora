import { Mail } from "lucide-react";

export default function MembershipInput( { value, onChange , onHandleSubscribe } ) {
  return (
    <div className="search-input-container w-full max-w-md mx-auto py-10 ">
      <div className="relative group flex items-center">
        {/* Search Icon (Left Side) */}
        <div className="absolute left-4 text-brand-muted group-focus-within:text-brand-green transition-colors">
          <Mail className="w-5 h-5" />
        </div>

        {/* Input Box */}
        <input
          type="text"
          onChange={onChange}
          value={value}
          placeholder="Email..." 
          className="w-full h-12 pl-12 pr-28 bg-brand-bg border border-brand-border text-brand-text rounded-2xl outline-none transition-all duration-300 focus:border-brand-green focus:ring-4 focus:ring-[var(--green-glow)] placeholder:text-brand-muted/60 shadow-sm"
        />

        {/* Search Button (Inside Input) */}
        <button onClick={onHandleSubscribe} className="absolute right-1.5 h-9 px-5 bg-brand-green hover:bg-brand-green-hover text-white font-medium rounded-xl transition-all duration-200 active:scale-95 cursor-pointer shadow-md" >
          Subscribe
        </button>
      </div>
    </div>
  );
}
