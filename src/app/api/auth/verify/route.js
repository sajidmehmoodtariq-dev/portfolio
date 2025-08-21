import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Owner from '@/models/Owner';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('owner-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      await connectDB();
      const owner = await Owner.findById(decoded.ownerId).select('-password');
      
      if (!owner || !owner.isActive) {
        return NextResponse.json(
          { success: false, message: 'Owner not found or inactive' },
          { status: 401 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          owner: {
            id: owner._id,
            username: owner.username,
            email: owner.email,
            role: owner.role
          }
        }
      });
      
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('GET /api/auth/verify error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 }
    );
  }
}
