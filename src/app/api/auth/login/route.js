import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Owner from '@/models/Owner';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Find owner by username
    const owner = await Owner.findOne({ 
      username,
      isActive: true 
    });
    
    if (!owner) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check password
    const isPasswordValid = await owner.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update last login
    owner.lastLogin = new Date();
    await owner.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        ownerId: owner._id,
        username: owner.username,
        role: owner.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set httpOnly cookie
    const cookieStore = cookies();
    cookieStore.set('owner-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        owner: {
          id: owner._id,
          username: owner.username,
          email: owner.email,
          role: owner.role
        }
      }
    });
    
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}
