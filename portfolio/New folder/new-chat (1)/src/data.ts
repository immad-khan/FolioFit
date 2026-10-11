export type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  tags: string[];
  role: string;
  metric: string;
};

export const projects: Project[] = [
  {
    id: "aether",
    index: "01",
    title: "Aether OS",
    category: "Spatial Operating System",
    year: "2025",
    image: "/images/project-aether.jpg",
    description:
      "A mixed-reality operating system where windows live in rooms and tools remember where you left them. Designed as a calm spatial environment for deep work — not another dashboard.",
    tags: ["Spatial UI", "System Design", "Motion"],
    role: "Lead Designer",
    metric: "Vision Pro · Desktop",
  },
  {
    id: "lumina",
    index: "02",
    title: "Lumina",
    category: "Digital Flagship",
    year: "2025",
    image: "/images/project-lumina.jpg",
    description:
      "A digital flagship for a fragrance house. The bottle is the interface — light, glass, and gold rendered as a tactile ritual rather than a product page.",
    tags: ["3D Product", "Brand", "WebGL"],
    role: "Creative Direction",
    metric: "Awwwards SOTD",
  },
  {
    id: "nexus",
    index: "03",
    title: "Nexus",
    category: "Private Banking",
    year: "2024",
    image: "/images/project-nexus.jpg",
    description:
      "Private banking, redesigned as a dark object you actually want to hold. Quiet typography, glass cards, and a hierarchy that treats wealth as a private conversation.",
    tags: ["Fintech", "Mobile", "Design System"],
    role: "Product Design",
    metric: "2.1M active",
  },
  {
    id: "orbit",
    index: "04",
    title: "Orbit",
    category: "Immersive Listening",
    year: "2024",
    image: "/images/project-orbit.jpg",
    description:
      "An immersive listening room for a streaming platform. Sound you can walk through — concentric light, spatial audio, and an interface that disappears when the music starts.",
    tags: ["Installation", "Audio", "Experience"],
    role: "Experience Design",
    metric: "FWA of the Day",
  },
  {
    id: "helios",
    index: "05",
    title: "Helios",
    category: "EV Configurator",
    year: "2023",
    image: "/images/project-helios.jpg",
    description:
      "A real-time configurator for an electric marque. Light treated as a material, paint as a living surface, and every option staged like a gallery rather than a form.",
    tags: ["Automotive", "Realtime 3D", "UI"],
    role: "Lead Product",
    metric: "38% conversion lift",
  },
  {
    id: "prism",
    index: "06",
    title: "Prism",
    category: "Architecture Studio",
    year: "2023",
    image: "/images/project-prism.jpg",
    description:
      "A digital gallery for an architecture practice. Space explaining space — volumes, shafts of light, and a slow cinematic scroll that feels like walking the building.",
    tags: ["Editorial", "3D", "Web"],
    role: "Art Direction",
    metric: "ADC Cube",
  },
];

export const skills = [
  "Spatial UI",
  "WebGL",
  "Three.js",
  "Blender",
  "Cinema 4D",
  "Unreal",
  "Figma",
  "React",
  "TypeScript",
  "GLSL",
  "Motion",
  "R3F",
  "Brand",
  "Prototyping",
  "After Effects",
  "Design Systems",
  "AR / VR",
  "Interaction",
];

export const experience = [
  {
    years: "2024 — Now",
    role: "Principal Designer",
    place: "Studio Solis",
    note: "Independent studio for spatial products, brand worlds, and mixed-reality systems.",
  },
  {
    years: "2021 — 2024",
    role: "Lead Product Designer",
    place: "Helix",
    note: "Shipped the Helios configurator and the Nexus banking system across web and native.",
  },
  {
    years: "2018 — 2021",
    role: "Interaction Designer",
    place: "North & Co",
    note: "Crafted motion languages and interface systems for culture, fashion, and auto.",
  },
  {
    years: "2016 — 2018",
    role: "Visual Designer",
    place: "Independent",
    note: "Identity, editorial, and early experiments in 3D interface design.",
  },
];

export const stats = [
  { value: "08", label: "Years" },
  { value: "40+", label: "Launches" },
  { value: "12", label: "Awards" },
  { value: "06", label: "Cities" },
];

export const marqueeItems = [
  "Spatial Interfaces",
  "Realtime 3D",
  "Brand Worlds",
  "Operating Systems",
  "Product Design",
  "Motion Language",
  "Mixed Reality",
  "Creative Technology",
];
