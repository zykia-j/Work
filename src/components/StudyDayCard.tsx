"use client";

import { ExternalLink, Clock, BookOpen, Code2, Zap } from "lucide-react";
import type { StudyDay } from "@/lib/types";

const DIFF_STYLES: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-400 border border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function StudyDayCard({
  day,
  locked,
}: {
  day: StudyDay;
  locked?: boolean;
}) {
  return (
    <div className={`card p-5 space-y-4 ${locked ? "opacity-50 select-none" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
              Day {day.day}
            </span>
            <span className="text-xs text-zinc-600">•</span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              {day.timeEstimate}
            </span>
          </div>
          <h3 className="font-semibold text-lg text-gray-100">{day.theme}</h3>
          <p className="text-sm text-zinc-400">{day.focusArea}</p>
        </div>
        {locked && (
          <span className="badge bg-zinc-800 border border-zinc-700 text-zinc-500">
            🔒 Locked
          </span>
        )}
      </div>

      {!locked && (
        <>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              <BookOpen className="h-3 w-3" />
              Concepts
            </div>
            <div className="flex flex-wrap gap-1.5">
              {day.concepts.map((c) => (
                <span
                  key={c}
                  className="badge bg-zinc-800 border border-zinc-700 text-zinc-300"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              <Code2 className="h-3 w-3" />
              LeetCode Problems
            </div>
            <div className="space-y-2">
              {day.problems.map((p) => (
                <div
                  key={p.title}
                  className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-100 hover:text-green-400 transition-colors flex items-center gap-1 text-sm"
                      >
                        {p.title}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                      <span className={`badge ${DIFF_STYLES[p.difficulty]}`}>
                        {p.difficulty}
                      </span>
                      <span className="badge bg-zinc-800 border border-zinc-700 text-zinc-400">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{p.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-green-400 mb-1">
              <Zap className="h-3 w-3" />
              Practice Task
            </div>
            <p className="text-sm text-zinc-300">{day.practiceTask}</p>
          </div>
        </>
      )}
    </div>
  );
}
