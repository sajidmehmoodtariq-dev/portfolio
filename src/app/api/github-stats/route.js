// app/api/github-stats/route.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const login = searchParams.get("login") || "sajidmehmoodtariq-dev";

    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN; // server-side only
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing GITHUB_TOKEN" }), { status: 500 });
    }

    // Year-to-date window
    const now = new Date();
    const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString();
    const toISO = now.toISOString();

    const query = `
      query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          createdAt
          repositories(privacy: PUBLIC, first: 1000) {
            totalCount
            nodes {
              primaryLanguage { name }
              stargazerCount
            }
          }
          # YTD contributions (for 2025 commits etc.)
          ytd: contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { date contributionCount }
              }
            }
          }
          # Last 365 days (for streak + longest streak)
          lastYear: contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { date contributionCount }
              }
            }
          }
        }
      }
    `;

    const body = JSON.stringify({
      query,
      variables: { login, from: yearStart, to: toISO },
    });

    const gh = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
      // next: { revalidate: 3600 } // (optional) ISR if you want
    });

    const json = await gh.json();
    if (!json?.data?.user) {
      return new Response(JSON.stringify({ error: "No data from GitHub", raw: json }), { status: 500 });
    }

    const user = json.data.user;

    const repoCount = user.repositories.totalCount;
    const languages = Array.from(
      new Set(
        user.repositories.nodes
          .map((r) => r.primaryLanguage?.name)
          .filter(Boolean)
      )
    );

    // Flatten contribution days
    const daysLastYear = user.lastYear.contributionCalendar.weeks.flatMap(w => w.contributionDays);
    const daysYTD = user.ytd.contributionCalendar.weeks.flatMap(w => w.contributionDays);

    // Helper: sort by date ASC
    const byDateAsc = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
    daysLastYear.sort(byDateAsc);
    daysYTD.sort(byDateAsc);

    // Compute CURRENT streak (count back from today including today if >0)
    const computeCurrentStreak = (days) => {
      let streak = 0;
      for (let i = days.length - 1; i >= 0; i--) {
        const d = days[i];
        // Guard against future dates (shouldn't exist)
        if (new Date(d.date) > new Date()) continue;
        if (d.contributionCount > 0) streak++;
        else break;
      }
      return streak;
    };

    // Compute LONGEST streak (max consecutive >0 in last 365 days)
    const computeLongestStreak = (days) => {
      let longest = 0;
      let current = 0;
      for (const d of days) {
        if (d.contributionCount > 0) {
          current++;
          if (current > longest) longest = current;
        } else {
          current = 0;
        }
      }
      return longest;
    };

    const currentStreak = computeCurrentStreak(daysLastYear);
    const longestStreak = computeLongestStreak(daysLastYear);

    const ytdCommits = user.ytd.totalCommitContributions;
    const ytdPRs = user.ytd.totalPullRequestContributions;
    const ytdIssues = user.ytd.totalIssueContributions;
    const lastYearTotal = user.lastYear.contributionCalendar.totalContributions;

    return Response.json({
      login,
      repoCount,
      languagesCount: languages.length,
      languages, // list of unique primary languages
      currentStreak,
      longestStreak,
      ytd: {
        commits: ytdCommits,
        prs: ytdPRs,
        issues: ytdIssues,
        totalContributions: user.ytd.contributionCalendar.totalContributions,
      },
      lastYear: {
        totalContributions: lastYearTotal,
      },
      createdAt: user.createdAt,
      fetchedAt: new Date().toISOString(),
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
