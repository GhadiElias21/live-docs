import {
  FaUsers,
  FaRobot,
  FaLock,
  FaGlobe,
  FaMagic,
  FaBolt,
  FaFileAlt,
  FaPlay,
  FaChevronRight,
  FaCheck,
  FaCode,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiFramer,
} from "react-icons/si";
export const features = [
  {
    icon: <FaUsers className="w-6 h-6" />,
    title: "Real-time Collaboration",
    description:
      "Edit documents simultaneously with your team. See changes live as they happen.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: <FaRobot className="w-6 h-6" />,
    title: "Smart AI Assistant",
    description:
      "Get writing suggestions, code completion, and instant formatting.",
    color: "from-green-500 to-cyan-400",
  },
  {
    icon: <FaLock className="w-6 h-6" />,
    title: "Secure & Encrypted",
    description:
      "End-to-end encryption ensures your documents stay private and secure.",
    color: "from-teal-500 to-emerald-400",
  },
  {
    icon: <FaGlobe className="w-6 h-6" />,
    title: "Access Anywhere",
    description:
      "Work seamlessly across all devices with automatic cloud sync.",
    color: "from-cyan-500 to-blue-400",
  },
  {
    icon: <FaMagic className="w-6 h-6" />,
    title: "Rich Formatting",
    description:
      "Markdown, code blocks, tables, and beautiful document templates.",
    color: "from-blue-500 to-indigo-400",
  },
  {
    icon: <FaBolt className="w-6 h-6" />,
    title: "Lightning Fast",
    description:
      "Optimized for speed with instant loading and zero-lag editing.",
    color: "from-indigo-500 to-purple-400",
  },
];

export const techStack = [
  {
    icon: <SiNextdotjs className="w-8 h-8" />,
    name: "Next.js 14",
    color: "text-white",
  },
  {
    icon: <SiTypescript className="w-8 h-8" />,
    name: "TypeScript",
    color: "text-blue-400",
  },
  {
    icon: <SiTailwindcss className="w-8 h-8" />,
    name: "Tailwind",
    color: "text-cyan-400",
  },
  {
    icon: <SiFramer className="w-8 h-8" />,
    name: "Framer Motion",
    color: "text-pink-400",
  },
];
