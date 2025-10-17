// app/api/job-notifications/application/[applicationId]/route.ts
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

export async function GET(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    await connectDB();
    const { applicationId } = params;

    const notification = await JobNotification.findOne({ applicationId });

    if (!notification) {
      return sendResponse(404, 'Job notification not found', null, {
        applicationId: 'Application ID does not exist'
      });
    }

    return sendResponse(200, 'Job notification retrieved successfully', notification);
  } catch (error: any) {
    console.error('GET application ID error:', error);
    return sendResponse(500, 'Internal server error', null, { error: error.message });
  }
}