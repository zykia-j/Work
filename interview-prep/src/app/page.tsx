"use client";

import { useState, useRef } from "react";
import {
  ArrowRight,
  Github,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import type { AnalysisPreview } from "@/lib/types";
import PreviewPanel from "@/components/PreviewPanel";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "preview"; planId: string; preview: AnalysisPreview }
  | { status: "error"; message: string };

const PLACEHOLDER_JD = `Software Engineer — Backend (Internship/New Grad)

We are looking for a backend engineer who can:
• Design scalable REST APIs using Node.js or Go
• Work with distributed systems and SQL/NoSQL databases
• Solve complex algorithmic problems (our interviews are LeetCode-style)
• Experience with AWS or GCP is a plus

Interview process: 2 coding rounds + 1 system design + 1 behavioral`;

export default function HomePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });
  const [unlocking, setUnlocking] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, githubUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState({ status: "error", message: data.error ?? "Analysis failed" });
        return;
      }

      setState({ status: "preview", planId: data.planId, preview: data.preview });
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setState({ status: "error", message: "Network error — please try again." });
    }
  }

  async function handleUnlock() {
    if (state.status !== "preview") return;
    setUnlocking(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: state.planId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        // Stripe not configured — go to results in demo mode
        window.location.href = `/results?planId=${state.planId}&demo=true`;
      }
    } catch {
      setUnlocking(false);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500">
              <Zap className="h-4 w-4 text-black" />
            </div>
            <span className="font-bold text-gray-100">PrepStack</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="#how-it-works" className="text-zinc-400 hover:text-gray-100 transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-zinc-400 hover:text-gray-100 transition-colors">
              Pricing
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-green-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 text-sm text-green-400">
            <Zap className="h-3.5 w-3.5" />
            AI-powered · Personalized · Role-specific
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 sm:text-6xl mb-5 leading-[1.1]">
            Stop guessing.{" "}
            <span className="text-green-400">Start targeting.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste a job description and your GitHub profile. Our AI reverse-engineers
            that company&apos;s interview patterns and generates a{" "}
            <span className="text-gray-100 font-medium">
              hyper-personalized 7-day study plan
            </span>{" "}
            based on your exact skill gaps.
          </p>

          {/* Form */}
          <form
            onSubmit={handleAnalyze}
            className="card p-6 text-left space-y-5 shadow-2xl"
          >
            <div>
              <label className="label">Job Description</label>
              <textarea
                className="textarea h-40"
                placeholder={PLACEHOLDER_JD}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                minLength={50}
              />
              <p className="mt-1 text-xs text-zinc-600">
                Paste the full job posting for best results
              </p>
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5" />
                GitHub Profile URL
              </label>
              <input
                type="url"
                className="input"
                placeholder="https://github.com/yourusername"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-zinc-600">
                Your public GitHub — we scan your repos for skill signals
              </p>
            </div>

            {state.status === "error" && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{state.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={state.status === "loading"}
              className="btn-primary w-full justify-center py-4 text-base"
            >
              {state.status === "loading" ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  Analyzing your gaps…
                </>
              ) : (
                <>
                  Analyze My Gaps
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-zinc-600">
              Free preview — see Day 1 + skill gaps before you pay
            </p>
          </form>

          {state.status === "loading" && (
            <div className="mt-8 space-y-3">
              {[
                "Scanning your GitHub repos…",
                "Reverse-engineering interview patterns…",
                "Identifying your skill gaps…",
                "Building your personalized plan…",
              ].map((step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-3 text-sm text-zinc-500 justify-center"
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-slow" />
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {state.status === "preview" && (
        <section ref={resultsRef} className="px-4 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-2 text-sm text-green-400 font-medium">
              <ChevronDown className="h-4 w-4" />
              Analysis complete — here&apos;s what we found
            </div>
            <PreviewPanel
              preview={state.preview}
              planId={state.planId}
              onUnlock={handleUnlock}
              unlocking={unlocking}
            />
          </div>
        </section>
      )}

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-20 border-t border-zinc-800">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-3">
              How it works
            </h2>
            <p className="text-zinc-400">
              Three steps from job posting to personalized prep plan
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: <Target className="h-6 w-6 text-green-400" />,
                step: "01",
                title: "Paste the job description",
                desc: "We extract the company's required skills, interview style, and what they actually test for.",
              },
              {
                icon: <Github className="h-6 w-6 text-green-400" />,
                step: "02",
                title: "Link your GitHub",
                desc: "We scan your repos to see your real-world skill signals — not what you claim, what you ship.",
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-green-400" />,
                step: "03",
                title: "Get your 7-day plan",
                desc: "A tailored daily study schedule with exact LeetCode problems, system design topics, and practice tasks.",
              },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-zinc-800 p-2.5">{icon}</div>
                  <span className="text-4xl font-black text-zinc-800">{step}</span>
                </div>
                <h3 className="font-semibold text-gray-100">{title}</h3>
                <p className="text-sm text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-20 border-t border-zinc-800">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-3">
            Simple pricing
          </h2>
          <p className="text-zinc-400 mb-8">One plan. One job. One shot.</p>

          <div className="card p-8 space-y-6 ring-1 ring-green-500/30">
            <div>
              <span className="text-5xl font-black text-gray-100">$15</span>
              <span className="text-zinc-500 ml-2">one-time</span>
            </div>
            <div className="text-left space-y-2.5">
              {[
                "7-day personalized study plan",
                "Company-specific LeetCode problems",
                "Skill gap analysis vs. job requirements",
                "System design topic list",
                "Behavioral interview prep",
                "Daily practice tasks",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="h-4 w-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="btn-primary w-full justify-center py-4">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="text-xs text-zinc-600">
              Start with a free preview · Pay only when you like what you see
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-green-500">
              <Zap className="h-3 w-3 text-black" />
            </div>
            <span>PrepStack</span>
          </div>
          <p>© {new Date().getFullYear()} PrepStack. Built for developers, by developers.</p>
        </div>
      </footer>
    </main>
  );
}
