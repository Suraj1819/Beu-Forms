// app/api/job-notifications/status/active/route.ts
import { NextRequest, NextResponse } from 'next/server';
import JobNotification from '@/models/jobNotificationModel';
import { connectDB } from '@/dbconfig/dbconfig.js';

const sendResponse = (
  statusCode: number,
  message: string,
  data: any = null,
  errors: any = null
) => {
  return NextResponse.json(
    {
      success: statusCode < 400,
      message,
      data,
      ...(errors && { errors }),
      timestamp: new Date().toISOString()
    },
    { status: statusCode }
  );
};

const validatePagination = (page: number, limit: number) => {
  const pageNum = Math.max(1, page || 1);
  const limitNum = Math.min(100, Math.max(1, limit || 10));

  return {
    page: pageNum,
    limit: limitNum
  };
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);
    const skip = (pageNum - 1) * limitNum;

    const [activeJobs, total] = await Promise.all([
      JobNotification.find({ isActive: true, status: 'Approved' })
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      JobNotification.countDocuments({ isActive: true, status: 'Approved' })
    ]);

    return sendResponse(200, 'Active jobs retrieved successfully', {
      jobs: activeJobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error: any) {
    console.error('GET active error:', error);
    return sendResponse(500, 'Internal server error', null, { error: error.message });
  }
}