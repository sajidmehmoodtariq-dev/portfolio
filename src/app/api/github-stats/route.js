import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("login");

  try {
    // Fetch contributions from GitHub GraphQL API
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($username:String!) {
            user(login: $username) {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { username },
      }),
    });

    const { data } = await response.json();

    const weeks = data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    const days = weeks.flatMap((week) => week.contributionDays);

    let currentStreak = 0;
    let longestStreak = 0;
    let totalContributions = 0;

    let streak = 0;
    for (let i = 0; i < days.length; i++) {
      if (days[i].contributionCount > 0) {
        streak++;
        if (streak > longestStreak) longestStreak = streak;
      } else {
        streak = 0;
      }
    }

    // Current streak (last continuous contribution days until today)
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Total contributions this year
    totalContributions = days.reduce((sum, d) => sum + d.contributionCount, 0);

    return NextResponse.json({
      repos: 57, // you can fetch repos separately
      commits: 559, // approximate commits (or fetch via API)
      totalContributions,
      currentStreak,
      longestStreak,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
