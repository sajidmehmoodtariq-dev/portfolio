import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// GET /api/blogs/[slug] - Get single blog by slug
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const blog = await Blog.findOne({ 
      slug: params.slug,
      published: true 
    }).lean();
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { blog }
    });
  } catch (error) {
    console.error('GET /api/blogs/[slug] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[slug] - Update blog by slug (protected)
export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('owner-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const body = await request.json();
    const { title, content, excerpt, tags, featured, published, imageUrl } = body;
    
    const blog = await Blog.findOne({ slug: params.slug });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Update fields
    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (tags !== undefined) blog.tags = tags;
    if (featured !== undefined) blog.featured = featured;
    if (published !== undefined) blog.published = published;
    if (imageUrl !== undefined) blog.imageUrl = imageUrl;
    
    await blog.save();
    
    return NextResponse.json({
      success: true,
      data: { blog },
      message: 'Blog updated successfully'
    });
    
  } catch (error) {
    console.error('PUT /api/blogs/[slug] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[slug] - Delete blog by slug (protected)
export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('owner-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const blog = await Blog.findOneAndDelete({ slug: params.slug });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE /api/blogs/[slug] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
