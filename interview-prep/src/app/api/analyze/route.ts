import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { fetchGitHubProfile, summarizeProfile } from "@/lib/github";
import { generateStudyPlan } from "@/lib/anthropic";
import { storePlan } from "@/lib/planCache";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { jobDescription, githubUrl } = body as {
    jobDescription: string;
    githubUrl: string;
  };

  if (!jobDescription?.trim() || !githubUrl?.trim()) {
    return NextResponse.json(
      { error: "Job description and GitHub URL are required." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const [profile] = await Promise.all([
      fetchGitHubProfile(githubUrl).catch(() => null),
    ]);

    const githubSummary = profile
      ? summarizeProfile(profile)
      : "GitHub profile unavailable — analyze based on job description alone.";

    const planId = uuidv4();
    const plan = await generateStudyPlan(jobDescription, githubSummary, planId);

    storePlan(planId, plan);

    return NextResponse.json({ planId, preview: plan.preview });
  } catch (err: unknown) {
    console.error("[analyze]", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
