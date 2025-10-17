// app/api/job-notifications/status/pending/route.ts
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

    const [pendingJobs, total] = await Promise.all([
      JobNotification.find({ status: 'Pending' })
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      JobNotification.countDocuments({ status: 'Pending' })
    ]);

    return sendResponse(200, 'Pending jobs retrieved successfully', {
      jobs: pendingJobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error: any) {
    console.error('GET pending error:', error);
    return sendResponse(500, 'Internal server error', null, { error: error.message });
  }
}