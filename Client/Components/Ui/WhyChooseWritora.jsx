import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft , ArrowRight } from "lucide-react"

const users = [
  {
    name: "Aarav",
    role: "Frontend Engineer",
    text: "Why choose Writora? Because it makes writing simple and powerful.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Meera",
    role: "Product Manager",
    text: "Writora helps teams collaborate and publish faster.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rohan",
    role: "UI Designer",
    text: "Clean UI and smooth experience make Writora stand out.",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

export default function WhyChooseWritora() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % users.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + users.length) % users.length);

  return (
    <div className=" max-w-5xl mx-auto mb-5 px-10 py-10  bg-brand-bg  shadow-green-glow rounded-2xl relative overflow-hidden">
      {/* Heart Box */}
      <div className="absolute top-4 right-4 w-10 h-10 bg-pink-200 rounded-xl flex items-center justify-center">
        ❤️
      </div>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={users[index].image}
          src={users[index].image}
          alt="user"
          initial={{ opacity: 0, rotate: -10, x: -50 }}
          animate={{ opacity: 1, rotate: -6, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-22 h-22 border-2 border-brand-accent object-cover rounded-lg absolute top-4 left-10  "
        />
      </AnimatePresence>

      {/* Content */}
      <div className="mt-44">
        <h2 className="text-2xl font-bold mb-2 text-brand-accent ">
          Why choose Writora?
        </h2>

        <p className="text-brand-text text-4xl mb-10 mt-5">
          {users[index].text}
        </p>

        {/* Role with animated line */}
        <div className="flex items-center gap-2">
          <motion.div
            key={users[index].role}
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 0.4 }}
            className="h-[2px] bg-blue-400"
          />
          <span className="text-sm text-brand-muted">
            {users[index].role}
          </span>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-start gap-2 mt-6">
        {users.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)} 
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === index ? "bg-brand-accent" : "bg-brand-muted/40"
            }`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="absolute bottom-4 right-4 flex  gap-2">
        <button
          onClick={prev}
          className="h-12 w-12 bg-brand-muted text-gray-800 flex items-center justify-center rounded-full cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={next}
          className="h-12 w-12 bg-brand-muted text-gray-800 flex items-center justify-center rounded-full cursor-pointer"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
