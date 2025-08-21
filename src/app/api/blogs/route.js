import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// GET /api/blogs - Get all published blogs
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const featured = searchParams.get('featured') === 'true';
    const tag = searchParams.get('tag');
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { published: true };
    if (featured) {
      query.featured = true;
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content') // Exclude full content for listing
      .lean();
    
    const total = await Blog.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog (protected)
export async function POST(request) {
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
    
    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { success: false, message: 'Title, content, and excerpt are required' },
        { status: 400 }
      );
    }
    
    // Generate slug manually as backup
    const generateSlug = (title) => {
      let baseSlug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
        .trim();
      
      if (!baseSlug) {
        baseSlug = 'untitled-blog';
      }
      
      const timestamp = Date.now().toString().slice(-6);
      return `${baseSlug}-${timestamp}`;
    };
    
    const blog = new Blog({
      title,
      content,
      excerpt,
      slug: generateSlug(title), // Set slug explicitly
      tags: tags || [],
      featured: featured || false,
      published: published !== undefined ? published : true,
      imageUrl: imageUrl || null
    });
    
    await blog.save();
    
    return NextResponse.json({
      success: true,
      data: { blog },
      message: 'Blog created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/blogs error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A blog with this title already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
