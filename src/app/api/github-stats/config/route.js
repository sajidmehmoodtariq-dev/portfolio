import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GitHubStatsConfig from "@/models/GitHubStatsConfig";

// Default available stats configuration
const defaultStatsConfig = [
  {
    key: 'totalRepos',
    title: 'Total Repositories',
    description: 'All public and private repositories',
    icon: '💻',
    gradient: 'from-emerald-400 to-sky-400',
    visible: true,
    order: 1
  },
  {
    key: 'publicRepos',
    title: 'Public Repositories',
    description: 'Open-source projects and repositories',
    icon: '🌐',
    gradient: 'from-blue-400 to-cyan-400',
    visible: false,
    order: 2
  },
  {
    key: 'contributionsThisYear',
    title: 'YTD Contributions',
    description: 'Contributions made this year',
    icon: '🔥',
    gradient: 'from-orange-400 to-red-400',
    visible: true,
    order: 3
  },
  {
    key: 'currentStreak',
    title: 'Current Streak',
    description: 'Consecutive days with contributions',
    icon: '⏱️',
    gradient: 'from-purple-400 to-pink-400',
    visible: true,
    order: 4
  },
  {
    key: 'longestStreak',
    title: 'Longest Streak',
    description: 'Maximum consecutive days contributed',
    icon: '🏆',
    gradient: 'from-yellow-400 to-orange-400',
    visible: false,
    order: 5
  },
  {
    key: 'totalStars',
    title: 'Total Stars',
    description: 'Stars earned across repositories',
    icon: '⭐',
    gradient: 'from-pink-400 to-rose-400',
    visible: true,
    order: 6
  },
  {
    key: 'totalForks',
    title: 'Total Forks',
    description: 'Forks across all repositories',
    icon: '🍴',
    gradient: 'from-indigo-400 to-purple-400',
    visible: false,
    order: 7
  },
  {
    key: 'followers',
    title: 'Followers',
    description: 'GitHub followers count',
    icon: '👥',
    gradient: 'from-green-400 to-blue-400',
    visible: false,
    order: 8
  },
  {
    key: 'following',
    title: 'Following',
    description: 'GitHub accounts followed',
    icon: '👤',
    gradient: 'from-teal-400 to-green-400',
    visible: false,
    order: 9
  },
  {
    key: 'contributionsLastWeek',
    title: 'Weekly Contributions',
    description: 'Contributions in the last week',
    icon: '📊',
    gradient: 'from-red-400 to-pink-400',
    visible: false,
    order: 10
  }
];

export async function GET() {
  try {
    await connectDB();
    
    let config = await GitHubStatsConfig.findOne({ isActive: true });
    
    if (!config) {
      // Create default configuration
      config = await GitHubStatsConfig.create({
        displayedStats: defaultStatsConfig,
        isActive: true
      });
    }
    
    return NextResponse.json({
      success: true,
      config: config.displayedStats,
      lastUpdated: config.lastUpdated
    });
    
  } catch (error) {
    console.error("Error fetching stats config:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch stats configuration",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const { displayedStats } = await req.json();
    
    if (!Array.isArray(displayedStats)) {
      return NextResponse.json(
        { error: "displayedStats must be an array" },
        { status: 400 }
      );
    }
    
    const updatedConfig = await GitHubStatsConfig.findOneAndUpdate(
      { isActive: true },
      {
        displayedStats,
        isActive: true,
        lastUpdated: new Date()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    
    return NextResponse.json({
      success: true,
      message: "Stats configuration updated successfully",
      config: updatedConfig.displayedStats,
      lastUpdated: updatedConfig.lastUpdated
    });
    
  } catch (error) {
    console.error("Error updating stats config:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update stats configuration",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
