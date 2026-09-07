import { Users, Globe, Award, Sparkles, CheckCircle2 } from "lucide-react";
import FooterSection from "../../Components/Ui/FooterSection";

export default function About() {
  const stats = [
    { label: "Active Writers", value: "12K+" },
    { label: "Stories Published", value: "85K+" },
    { label: "Monthly Readers", value: "1.2M" },
  ];

  const teamMember = [
    {
      id  : 1,
      name : "Alex",
      position : "Founder & CEO",
      img : "https://img.freepik.com/free-photo/portrait-smiling-young-man_1268-21877.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
      id : 2,
      name : "Piter Ads",
      position : "Account Manager",
      img : "https://www.csinow.edu/wp-content/uploads/2025/02/computersystemsinstitute-355913-man-laptop-coding-blogbanner-1-1.jpg"
    },
    {
      id : 3,
      name : "Alisha SDE",
      position : "Social Media Manager",
      img : "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
      id : 4,
      name : "John SDE",
      position : "Product Manager",
      img : "https://www.shutterstock.com/image-photo/portrait-smiling-teenager-boy-braces-260nw-2501494949.jpg"
    }
  ]

  return (
    <div className="AboutPage bg-brand-bg min-h-screen transition-colors duration-300">
      
      {/* 1. Hero Section: The Vision */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-brand-border">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 text-brand-accent rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Our Journey
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-brand-text tracking-tighter leading-tight">
            We believe everyone has a <br />
            <span className="text-brand-accent italic underline decoration-brand-green/30">story to tell.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-muted max-w-3xl mx-auto leading-relaxed">
            Writora was founded in 2026 with a simple mission: to create a space where 
            quality writing thrives, and curious minds can connect without distractions.
          </p>
          
          {/* Main Image */}
          <div className="mt-12 rounded-[3rem] overflow-hidden border border-brand-border shadow-2xl aspect-video md:aspect-[21/9]">
            <img 
              src="https://cdn.dribbble.com/userupload/25286810/file/original-25a987b5055b056376f5d1a10fad76c2.png?resize=1504x1128&vertical=center" 
              alt="Team collaborating" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-16 border-b border-brand-border bg-brand-hover/20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2">
              <h2 className="text-5xl font-black text-brand-text italic">{stat.value}</h2>
              <p className="text-brand-muted font-medium uppercase tracking-widest text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Values: The "Why" */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-brand-text tracking-tight">Built for writers, <br/>by writers.</h2>
            <p className="text-brand-muted leading-relaxed">
              In an era of short-form noise, Writora is a sanctuary for deep thinking. 
              We prioritize substance over clicks, and clarity over chaos.
            </p>
            <ul className="space-y-4">
              {['No intrusive ads', 'Clean reading experience', 'Community-driven growth'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-brand-text font-medium">
                  <CheckCircle2 className="w-5 h-5 text-brand-green" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://www.byemilyrae.com/wp-content/uploads/2026/06/Writers-Website-thumb.jpg" className=" rounded-2xl border border-brand-border shadow-lg "  alt="Writing" />
            <img src="https://www.techtarget.com/rms/onlineimages/what_is_a_blog_used_for-f_mobile.png" className="  rounded-2xl border border-brand-border shadow-lg" alt="Community" />
          </div>
        </div>
      </section>

      {/* 4. Team Section */}
      <section className="py-24 bg-brand-hover/30 border-t border-brand-border">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-brand-text mb-12">Meet the Visionaries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMember.map((member) => (
              <div key={member.id} className="group">
                <div className="w-full aspect-square rounded-3xl overflow-hidden mb-4 border border-brand-border grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={member.img} alt="Team member" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-bold text-brand-text">{member.name}</h4>
                <p className="text-sm text-brand-muted">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
