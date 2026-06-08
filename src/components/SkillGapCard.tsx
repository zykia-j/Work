"use client";

import type { SkillGap } from "@/lib/types";

const LEVEL_WIDTH: Record<string, string> = {
  None: "w-0",
  Beginner: "w-1/4",
  Intermediate: "w-1/2",
  Strong: "w-3/4",
  Expert: "w-full",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "bg-red-500/10 border-red-500/30 text-red-400",
  High: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  Medium: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
};

export default function SkillGapCard({ gap }: { gap: SkillGap }) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-gray-100">{gap.skill}</h4>
        <span
          className={`badge border ${PRIORITY_COLORS[gap.priority]} whitespace-nowrap`}
        >
          {gap.priority}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>You: {gap.currentLevel}</span>
          <span>Required: {gap.requiredLevel}</span>
        </div>
        <div className="relative h-2 rounded-full bg-zinc-800">
          <div
            className={`absolute left-0 top-0 h-full rounded-full bg-zinc-600 transition-all ${LEVEL_WIDTH[gap.currentLevel]}`}
          />
          <div
            className={`absolute left-0 top-0 h-full rounded-full bg-green-500/40 ${LEVEL_WIDTH[gap.requiredLevel]}`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>None</span>
          <span>Expert</span>
        </div>
      </div>

      <p className="text-sm text-zinc-400">{gap.notes}</p>
    </div>
  );
}
