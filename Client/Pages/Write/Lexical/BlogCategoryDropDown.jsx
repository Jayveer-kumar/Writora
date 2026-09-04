import { useEffect, useRef, useState } from "react";

const categories = [
  "Technology",
  "Programming",
  "Web Development",
  "Artificial Intelligence",
  "News",
  "Education",
  "Business",
  "Lifestyle",
  "Health & Fitness",
  "Travel",
  "Entertainment",  
  "Other",
];

export default function BlogCategoryDropDown({
  value,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (category) => {
    onChange(category);
    setIsOpen(false);
  };
//   w-full max-w-md

  

  return (
    <div className=" " ref={dropdownRef}>

      <div className="relative">
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left transition-all duration-300 ${
            isOpen
              ? "border-violet-500 ring-4 ring-violet-100"
              : "border-gray-200 hover:border-violet-400"
          }`}
        >
          <span
            className={value ? "text-gray-800" : "text-gray-400"}
          >
            {value || "Choose a category"}
          </span>

          {/* Arrow */}
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute z-50 mt-2 w-full origin-top overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl transition-all duration-300 ${
            isOpen
              ? "visible scale-100 opacity-100"
              : "invisible scale-95 opacity-0"
          }`}
        >
          <div className="max-h-64 overflow-y-auto p-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelect(category)}
                className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-sm transition-all duration-200 ${
                  value === category
                    ? "bg-violet-100 font-semibold text-violet-700"
                    : "text-gray-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}