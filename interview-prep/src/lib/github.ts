import type { GitHubProfile, GitHubRepo } from "./types";

function extractUsername(input: string): string {
  const cleaned = input.trim().replace(/\/$/, "");

  if (cleaned.startsWith("https://github.com/")) {
    const parts = cleaned.replace("https://github.com/", "").split("/");
    return parts[0];
  }
  if (cleaned.startsWith("github.com/")) {
    const parts = cleaned.replace("github.com/", "").split("/");
    return parts[0];
  }
  if (!cleaned.includes("/") && !cleaned.includes(".")) {
    return cleaned;
  }
  throw new Error("Could not parse GitHub username from: " + input);
}

export async function fetchGitHubProfile(
  githubUrl: string
): Promise<GitHubProfile> {
  const username = extractUsername(githubUrl);
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      { headers }
    ),
  ]);

  if (!userRes.ok) {
    throw new Error(`GitHub user not found: ${username}`);
  }

  const user = await userRes.json();
  const rawRepos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

  const repos: GitHubRepo[] = rawRepos
    .filter((r) => !r.name.includes(".github.io") || rawRepos.length < 5)
    .slice(0, 20)
    .map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      topics: (r as any).topics ?? [],
      stargazers_count: r.stargazers_count,
    }));

  const languages: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] ?? 0) + 1;
    }
  }

  return {
    login: user.login,
    name: user.name,
    bio: user.bio,
    repos,
    languages,
  };
}

export function summarizeProfile(profile: GitHubProfile): string {
  const topLangs = Object.entries(profile.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([lang, count]) => `${lang} (${count} repos)`)
    .join(", ");

  const topRepos = profile.repos
    .slice(0, 8)
    .map(
      (r) =>
        `  - ${r.name}${r.description ? ": " + r.description : ""}${r.language ? " [" + r.language + "]" : ""}${r.topics.length ? " topics: " + r.topics.join(", ") : ""}`
    )
    .join("\n");

  return `GitHub: ${profile.login} (${profile.name ?? "N/A"})
Bio: ${profile.bio ?? "N/A"}
Primary languages: ${topLangs || "N/A"}
Recent repos:
${topRepos}`;
}
