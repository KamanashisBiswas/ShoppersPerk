import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

interface SocialMediaProps {
  className?: string;
}

export default function SocialMedia({ className = "" }: SocialMediaProps) {
  const socialLinks = [
    {
      id: 1,
      name: "Instagram",
      icon: FaInstagram,
      href: "https://instagram.com",
      bgClass: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500",
      textClass: "text-white",
    },
    {
      id: 2,
      name: "Facebook",
      icon: FaFacebookF,
      href: "https://facebook.com",
      bgClass: "bg-[#1877F2]",
      textClass: "text-white",
    },
    {
      id: 3,
      name: "YouTube",
      icon: FaYoutube,
      href: "https://youtube.com",
      bgClass: "bg-[#FF0000]",
      textClass: "text-white",
    },
    {
      id: 4,
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: "https://whatsapp.com",
      bgClass: "bg-[#25D366]",
      textClass: "text-white",
    },
  ];

  return (
    <div className={`flex gap-3 md:gap-4 ${className}`}>
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md ${social.bgClass}`}
            aria-label={social.name}
          >
            <Icon className={`text-sm md:text-xl ${social.textClass}`} />
          </a>
        );
      })}
    </div>
  );
}
