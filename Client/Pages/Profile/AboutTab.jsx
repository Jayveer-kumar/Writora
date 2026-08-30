export default function AboutTab({USER}) {
  return (
    <>
      <div className="about-section">
        <h4>Personal Info</h4>
        {[
          { icon: "📍", label: "Location", val: USER.location },
          { icon: "🔗", label: "Website", val: USER.website },
          { icon: "📅", label: "Joined", val: USER.joined },
        ].map((item) => (
          <div className="about-info-item" key={item.label}>
            <div className="about-icon">{item.icon}</div>
            <div>
              <span>{item.label}</span>
              <strong>{item.val}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="about-section">
        <h4>Skills</h4>
        <div className="skill-chips">
          {["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GraphQL", "Tailwind CSS", "Next.js"].map((s) => (
            <span className="skill-chip" key={s}>{s}</span>
          ))}
        </div>
      </div>
    </>
  );
}

// export default function AboutTab({ USER }) {
//   return (
//     <>
//       {/* Personal Info Section */}
//       <div className="mb-7">
//         <h4 className="font-['Syne'] text-[11px] font-bold text-brand-muted uppercase tracking-[1.2px] mb-3.5">
//           Personal Info
//         </h4>
//         {[
//           { icon: "📍", label: "Location", val: USER.location },
//           { icon: "🔗", label: "Website", val: USER.website },
//           { icon: "📅", label: "Joined", val: USER.joined },
//         ].map((item) => (
//           <div 
//             className="flex gap-3 py-3 border-b border-brand-border items-center text-sm last:border-b-0" 
//             key={item.label}
//           >
//             {/* About Icon */}
//             <div className="w-8 h-8 bg-brand-card-bg border border-brand-border rounded-lg flex items-center justify-center text-[15px] shrink-0">
//               {item.icon}
//             </div>
//             <div>
//               <span className="block text-[12px] text-brand-muted leading-tight">
//                 {item.label}
//               </span>
//               <strong className="block text-[13px] text-brand-text font-semibold">
//                 {item.val}
//               </strong>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Skills Section */}
//       <div className="mb-7">
//         <h4 className="font-['Syne'] text-[11px] font-bold text-brand-muted uppercase tracking-[1.2px] mb-3.5">
//           Skills
//         </h4>
//         <div className="flex flex-wrap gap-2">
//           {["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "GraphQL", "Tailwind CSS", "Next.js"].map((s) => (
//             <span 
//               className="bg-brand-card-bg border border-brand-border rounded-lg px-3.5 py-1.5 text-[13px] text-brand-text hover:border-brand-accent transition-colors cursor-default" 
//               key={s}
//             >
//               {s}
//             </span>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }
