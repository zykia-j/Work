import Anthropic from "@anthropic-ai/sdk";
import type { FullStudyPlan } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an elite technical interview coach who reverse-engineers company hiring patterns.
Given a job description and a candidate's GitHub profile, you produce a hyper-personalized 7-day interview prep plan.

You must return ONLY valid JSON matching the FullStudyPlan schema. No markdown fences, no extra text.

Rules:
- LeetCode URLs must follow: https://leetcode.com/problems/<slug>/
- Use real LeetCode problem names (e.g. "Two Sum", "Merge K Sorted Lists")
- Be specific about WHY each problem was chosen for this exact company/role
- Identify the company's known interview style if recognizable (FAANG/startup/etc)
- Day 1 should close the most critical gap
- Difficulty should escalate across the 7 days
- Problems per day: 2–4, time estimate: 3–6 hours`;

export async function generateStudyPlan(
  jobDescription: string,
  githubSummary: string,
  planId: string
): Promise<FullStudyPlan> {
  const userPrompt = `JOB DESCRIPTION:
${jobDescription}

CANDIDATE GITHUB PROFILE:
${githubSummary}

Generate a complete 7-day Success Pack. Return JSON only.

Required schema:
{
  "planId": "${planId}",
  "preview": {
    "companyName": "string (infer from JD or use 'Target Company')",
    "roleName": "string",
    "interviewStyle": "string (e.g. 'FAANG-style heavy DS&A', 'Startup full-stack', etc.)",
    "topGaps": [
      {
        "skill": "string",
        "currentLevel": "None|Beginner|Intermediate|Strong",
        "requiredLevel": "Beginner|Intermediate|Strong|Expert",
        "priority": "Critical|High|Medium",
        "notes": "string (1-2 sentences)"
      }
    ],
    "strengths": ["string"],
    "day1": { <StudyDay object> },
    "keyInsight": "string (1 sentence about the biggest gap to close)"
  },
  "days": [ <array of 7 StudyDay objects> ],
  "systemDesignTopics": ["string"],
  "behavioralTopics": ["string"],
  "finalAdvice": "string (3-4 sentences of parting wisdom)"
}

StudyDay schema:
{
  "day": number,
  "theme": "string (catchy theme name)",
  "focusArea": "string",
  "timeEstimate": "string (e.g. '4-5 hours')",
  "concepts": ["string"],
  "problems": [
    {
      "title": "string (exact LeetCode title)",
      "difficulty": "Easy|Medium|Hard",
      "category": "string",
      "url": "https://leetcode.com/problems/<slug>/",
      "why": "string (why this problem for this specific job)"
    }
  ],
  "practiceTask": "string (a mini project or coding exercise beyond LeetCode)"
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const plan: FullStudyPlan = JSON.parse(raw);
    plan.planId = planId;
    return plan;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const plan: FullStudyPlan = JSON.parse(match[0]);
      plan.planId = planId;
      return plan;
    }
    throw new Error("Failed to parse Claude response as JSON");
  }
}
