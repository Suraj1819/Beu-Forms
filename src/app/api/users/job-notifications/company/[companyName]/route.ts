// app/api/job-notifications/company/[companyName]/route.ts
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

export async function GET(
  request: NextRequest,
  { params }: { params: { companyName: string } }
) {
  try {
    await connectDB();

    const { companyName } = params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!companyName || companyName.trim().length === 0) {
      return sendResponse(400, 'Company name is required', null, {
        companyName: 'Company name cannot be empty'
      });
    }

    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      JobNotification.find({
        companyName: { $regex: companyName, $options: 'i' },
        isActive: true
      })
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      JobNotification.countDocuments({
        companyName: { $regex: companyName, $options: 'i' },
        isActive: true
      })
    ]);

    if (jobs.length === 0) {
      return sendResponse(404, 'No jobs found for this company');
    }

    return sendResponse(200, 'Company jobs retrieved successfully', {
      jobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error: any) {
    console.error('GET company error:', error);
    return sendResponse(500, 'Internal server error', null, { error: error.message });
  }
}