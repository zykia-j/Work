"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Code2,
  Users,
  Sparkles,
  Zap,
} from "lucide-react";
import type { FullStudyPlan } from "@/lib/types";
import StudyDayCard from "@/components/StudyDayCard";
import SkillGapCard from "@/components/SkillGapCard";

type FetchState =
  | { status: "loading" }
  | { status: "success"; plan: FullStudyPlan }
  | { status: "error"; message: string };

function ResultsContent() {
  const params = useSearchParams();
  const planId = params.get("planId");
  const sessionId = params.get("session_id");
  const demo = params.get("demo");

  const [fetchState, setFetchState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    if (!planId) {
      setFetchState({ status: "error", message: "No plan ID found in URL." });
      return;
    }

    const url = new URL("/api/verify", window.location.origin);
    url.searchParams.set("planId", planId);
    if (sessionId) url.searchParams.set("session_id", sessionId);
    if (demo) url.searchParams.set("demo", "true");

    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => {
        if (data.plan) {
          setFetchState({ status: "success", plan: data.plan });
        } else {
          setFetchState({
            status: "error",
            message: data.error ?? "Could not load plan.",
          });
        }
      })
      .catch(() =>
        setFetchState({ status: "error", message: "Network error." })
      );
  }, [planId, sessionId, demo]);

  if (fetchState.status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-zinc-700 border-t-green-500 animate-spin" />
        <p className="text-zinc-400">Loading your Success Pack…</p>
      </div>
    );
  }

  if (fetchState.status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-400 text-lg">{fetchState.message}</p>
        <a href="/" className="btn-outline">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </a>
      </div>
    );
  }

  const { plan } = fetchState;

  return (
    <main className="min-h-screen pb-20">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 text-zinc-400 hover:text-gray-100 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500">
              <Zap className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="font-bold text-sm">PrepStack</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 pt-8 space-y-10">
        {/* Success banner */}
        <div className="card p-6 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-green-500/10 p-3 shrink-0">
              <CheckCircle className="h-7 w-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-100">
                Your 7-Day Success Pack is ready!
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                {plan.preview.roleName} at {plan.preview.companyName} ·{" "}
                {plan.preview.interviewStyle}
              </p>
            </div>
          </div>
        </div>

        {/* Key insight */}
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Key Insight
          </div>
          <p className="text-gray-100">{plan.preview.keyInsight}</p>
        </div>

        {/* Skill gaps */}
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            <Code2 className="h-4 w-4" />
            Skill Gap Analysis
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.preview.topGaps.map((gap) => (
              <SkillGapCard key={gap.skill} gap={gap} />
            ))}
          </div>
        </section>

        {/* 7-day plan */}
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            <BookOpen className="h-4 w-4" />
            Your 7-Day Plan
          </h2>
          <div className="space-y-4">
            {plan.days.map((day) => (
              <StudyDayCard key={day.day} day={day} />
            ))}
          </div>
        </section>

        {/* System design + behavioral */}
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              <Code2 className="h-4 w-4" />
              System Design Topics
            </h3>
            <ul className="space-y-1.5">
              {plan.systemDesignTopics.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-zinc-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              <Users className="h-4 w-4" />
              Behavioral Topics
            </h3>
            <ul className="space-y-1.5">
              {plan.behavioralTopics.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-zinc-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Final advice */}
        <div className="card p-6 border-zinc-700">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            <Sparkles className="h-4 w-4 text-green-400" />
            Final Advice
          </div>
          <p className="text-zinc-300 leading-relaxed">{plan.finalAdvice}</p>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-zinc-700 border-t-green-500 animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
