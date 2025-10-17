// app/api/job-notifications/[id]/hold/route.ts
import { NextRequest, NextResponse } from 'next/server';
import JobNotification from '@/models/jobNotificationModel';
import { connectDB } from '@/dbconfig/dbconfig.js';
import { isValidObjectId } from 'mongoose';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const { reviewerName, reviewNotes } = body;

    if (!isValidObjectId(id)) {
      return sendResponse(400, 'Invalid job notification ID', null, { id: 'Invalid ID format' });
    }

    if (!reviewerName || reviewerName.trim().length === 0) {
      return sendResponse(400, 'Reviewer name is required', null, {
        reviewerName: 'Reviewer name cannot be empty'
      });
    }

    const notification = await JobNotification.findById(id);

    if (!notification) {
      return sendResponse(404, 'Job notification not found');
    }

    const holdNotification = await notification.putOnHold(reviewerName, reviewNotes || '');

    return sendResponse(200, 'Job notification put on hold successfully', holdNotification);
  } catch (error: any) {
    console.error('PATCH hold error:', error);
    return sendResponse(500, 'Internal server error', null, { error: error.message });
  }
}