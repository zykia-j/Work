export interface LeetCodeProblem {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  url: string;
  why: string;
}

export interface StudyDay {
  day: number;
  theme: string;
  focusArea: string;
  timeEstimate: string;
  concepts: string[];
  problems: LeetCodeProblem[];
  practiceTask: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: "None" | "Beginner" | "Intermediate" | "Strong";
  requiredLevel: "Beginner" | "Intermediate" | "Strong" | "Expert";
  priority: "Critical" | "High" | "Medium";
  notes: string;
}

export interface AnalysisPreview {
  companyName: string;
  roleName: string;
  interviewStyle: string;
  topGaps: SkillGap[];
  strengths: string[];
  day1: StudyDay;
  keyInsight: string;
}

export interface FullStudyPlan {
  planId: string;
  preview: AnalysisPreview;
  days: StudyDay[];
  systemDesignTopics: string[];
  behavioralTopics: string[];
  finalAdvice: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  repos: GitHubRepo[];
  languages: Record<string, number>;
}
