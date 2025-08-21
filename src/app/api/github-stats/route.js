import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GitHubStats from "@/models/GitHubStats";

export async function GET(req) {
  try {
    await connectDB();

    // Get the active GitHub stats from database
    const stats = await GitHubStats.findOne({ isActive: true });

    if (!stats) {
      return NextResponse.json(
        { error: "GitHub stats not found. Please seed the database first." },
        { status: 404 }
      );
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats from database" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const statsData = await req.json();

    // Find and update the active stats, or create new one
    const updatedStats = await GitHubStats.findOneAndUpdate(
      { isActive: true },
      {
        ...statsData,
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
      message: "GitHub stats updated successfully",
      data: updatedStats
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update GitHub stats in database" },
      { status: 500 }
    );
  }
}
