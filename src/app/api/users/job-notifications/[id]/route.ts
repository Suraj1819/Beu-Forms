// app/api/job-notifications/[id]/route.ts
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

// ==================== GET BY ID ====================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return sendResponse(400, 'Invalid job notification ID', null, { id: 'Invalid ID format' });
    }

    const notification = await JobNotification.findById(id);

    if (!notification) {
      return sendResponse(404, 'Job notification not found');
    }

    return sendResponse(200, 'Job notification retrieved successfully', notification);
  } catch (error: any) {
    console.error('GET [id] error:', error);
    return sendResponse(500, 'Internal server error', null, { error: error.message });
  }
}

// ==================== UPDATE ====================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();

    if (!isValidObjectId(id)) {
      return sendResponse(400, 'Invalid job notification ID', null, { id: 'Invalid ID format' });
    }

    const notification = await JobNotification.findById(id);

    if (!notification) {
      return sendResponse(404, 'Job notification not found');
    }

    const allowedUpdates = [
      'aboutCompany', 'correspondenceAddress', 'dateOfEstablishment', 'numberOfEmployees',
      'socialMediaLink', 'headHRName', 'headHRContact', 'headHREmail', 'firstContactName',
      'firstContactEmail', 'firstContactPhone', 'secondContactName', 'secondContactEmail',
      'secondContactPhone', 'jobProfile', 'jobTitle', 'jobDescription', 'jobLocation',
      'requiredSkills', 'jobDesignationBTech', 'jobDescBTech', 'jobDesignationMTech',
      'jobDescMTech', 'jobDesignationPhD', 'jobDescPhD', 'cgpaCutoff', 'syllabus'
    ];

    const updates = Object.keys(body);
    const invalidUpdates = updates.filter(update => !allowedUpdates.includes(update));

    if (invalidUpdates.length > 0) {
      return sendResponse(400, 'Invalid update fields', null, {
        fields: `These fields cannot be updated: ${invalidUpdates.join(', ')}`
      });
    }

    Object.assign(notification, body);
    const updatedNotification = await notification.save();

    return sendResponse(200, 'Job notification updated successfully', updatedNotification);
  } catch (error: any) {
    console.error('PUT [id] error:', error);
    return sendResponse(500, 'Internal server error', null, { error: error.message });
  }
}

// ==================== DELETE (SOFT) ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return sendResponse(400, 'Invalid job notification ID', null, { id: 'Invalid ID format' });
    }

    const notification = await JobNotification.findById(id);

    if (!notification) {
      return sendResponse(404, 'Job notification not found');
    }

    notification.isActive = false;
    await notification.save();

    return sendResponse(200, 'Job notification deleted successfully', notification);
  } catch (error: any) {
    console.error('DELETE [id] error:', error);
    return sendResponse(500, 'Internal server error', null, { error: error.message });
  }
}