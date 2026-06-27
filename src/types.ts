export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
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
