"use client";

import { Sparkles, TrendingUp, Lock, CheckCircle } from "lucide-react";
import type { AnalysisPreview } from "@/lib/types";
import SkillGapCard from "./SkillGapCard";
import StudyDayCard from "./StudyDayCard";

interface Props {
  preview: AnalysisPreview;
  planId: string;
  onUnlock: () => void;
  unlocking: boolean;
}

export default function PreviewPanel({
  preview,
  planId,
  onUnlock,
  unlocking,
}: Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-green-500/10 p-3">
            <Sparkles className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-100">
                {preview.roleName}
              </h2>
              <span className="badge bg-zinc-800 border border-zinc-700 text-zinc-400">
                {preview.companyName}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-3">{preview.interviewStyle}</p>
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
              <p className="text-sm text-yellow-300">
                <span className="font-semibold">Key Insight: </span>
                {preview.keyInsight}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {preview.strengths.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Your Strengths
          </h3>
          <div className="flex flex-wrap gap-2">
            {preview.strengths.map((s) => (
              <span
                key={s}
                className="badge border bg-green-500/10 border-green-500/20 text-green-300 px-3 py-1"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skill Gaps */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          <TrendingUp className="h-4 w-4 text-orange-400" />
          Critical Skill Gaps
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {preview.topGaps.map((gap) => (
            <SkillGapCard key={gap.skill} gap={gap} />
          ))}
        </div>
      </div>

      {/* Day 1 Preview */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Day 1 Preview (free)
        </h3>
        <StudyDayCard day={preview.day1} />
      </div>

      {/* Paywall */}
      <div className="card p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/80 to-zinc-900 pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
            <Lock className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              Unlock Your Full 7-Day Success Pack
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Get all 7 days of personalized LeetCode problems, system design
              topics, behavioral prep, and a daily practice roadmap — tailored
              to this exact role.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm text-zinc-400">
            {[
              "7 days of problems",
              "System design prep",
              "Behavioral coaching",
              "Daily practice tasks",
            ].map((f) => (
              <span key={f} className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                {f}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onUnlock}
              disabled={unlocking}
              className="btn-primary text-base px-8 py-4"
            >
              {unlocking ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  Redirecting to checkout…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Unlock Full Plan — $15
                </>
              )}
            </button>
            <p className="text-xs text-zinc-600">
              One-time payment · No subscription · Instant access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
