import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Instagram, Copyright, Heart } from "lucide-react";

export default function FooterSection() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { title: "Product", links: ["Features", "Membership", "Write", "Feed"] },
        { title: "Company", links: ["Our Story", "Team", "Careers", "Contact"] },
        { title: "Support", links: ["Help Center", "Privacy", "Terms", "Status"] }
    ];

    const socials = [
        { icon: <Twitter className="w-5 h-5" />, link: "#" },
        { icon: <Github className="w-5 h-5" />, link: "#" },
        { icon: <Linkedin className="w-5 h-5" />, link: "#" },
        { icon: <Instagram className="w-5 h-5" />, link: "#" }
    ];

    return (
        <footer className="bg-brand-bg border-t border-brand-border pt-20 pb-10">
            <div className="max-w-5xl mx-auto px-4">
                
                {/* Top Section: Logo & Links */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
                    
                    {/* Logo & Tagline */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold text-brand-text tracking-tight">
                            Writora<span className="text-brand-accent">.</span>
                        </h2>
                        <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
                            A place where ideas grow. Join our community to share stories 
                            and connect with thinkers worldwide.
                        </p>
                        <div className="flex gap-4">
                            {socials.map((social, idx) => (
                                <a key={idx} href={social.link} className="p-2 bg-brand-hover rounded-full text-brand-muted hover:text-brand-accent transition-all">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {footerLinks.map((col, idx) => (
                        <div key={idx} className="space-y-4">
                            <h4 className="text-sm font-bold text-brand-text uppercase tracking-widest">
                                {col.title}
                            </h4>
                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link to="#" className="text-sm text-brand-muted hover:text-brand-accent transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section: Copyright */}
                <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-muted font-medium">
                    <div className="flex items-center gap-2">
                        <Copyright className="w-3.5 h-3.5" />
                        <span>{currentYear} Writora Inc. All rights reserved.</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by 
                        <span className="text-brand-text font-bold">Writora Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
