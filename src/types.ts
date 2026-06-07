export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  features?: string[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  year: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  description: string;
  location: string;
}

export interface TechSkill {
  name: string;
  color: string; // The color class or hexadecimal code
  textColor?: string; // Optional text color overrides
  category: "Language" | "Cloud" | "Framework" | "Database" | "Design" | "Data & AI" | "CI/CD & Git" | "Testing & Devops";
}
