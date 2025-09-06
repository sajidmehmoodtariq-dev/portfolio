import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GitHubStats from "@/models/GitHubStats";

// This endpoint is designed to be called by a cron job or scheduled task
export async function POST(req) {
  try {
    // Verify this is coming from a trusted source (optional)
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'default-secret';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use the same logic from the main API to fetch fresh data
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/github-stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log('GitHub stats synced successfully:', new Date().toISOString());
      return NextResponse.json({
        success: true,
        message: 'GitHub stats synced successfully',
        timestamp: new Date().toISOString(),
        ...data // Spread the flattened response
      });
    } else {
      throw new Error(data.error || 'Failed to sync stats');
    }

  } catch (error) {
    console.error("Error syncing GitHub stats:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to sync GitHub stats",
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET() {
  try {
    await connectDB();
    
    const stats = await GitHubStats.findOne({ isActive: true });
    
    if (!stats) {
      return NextResponse.json({
        synced: false,
        message: 'No GitHub stats found in database'
      });
    }

    const now = new Date();
    const lastUpdate = new Date(stats.lastUpdated);
    const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
    
    return NextResponse.json({
      synced: true,
      lastUpdated: stats.lastUpdated,
      hoursSinceUpdate: Math.round(hoursSinceUpdate * 100) / 100,
      isStale: hoursSinceUpdate > 24,
      nextSyncRecommended: hoursSinceUpdate > 12
    });

  } catch (error) {
    console.error("Error checking sync status:", error);
    return NextResponse.json(
      { error: "Failed to check sync status" },
      { status: 500 }
    );
  }
}
