// app/api/student/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/dbconfig/dbconfig';
import StudentFeedback from '@/models/studentFeedbackModels';
import { z } from 'zod';

// ==================== TYPES ====================
interface ValidationError {
  [key: string]: string;
}

interface PaginationParams {
  isValid: boolean;
  errors: ValidationError | null;
  page: number;
  limit: number;
}

interface ApiResponseData {
  success: boolean;
  message: string;
  data?: unknown; // Changed from Record<string, unknown> to unknown
  errors?: ValidationError | null;
  timestamp: string;
  statusCode?: number;
}

interface FeedbackItem {
  _id: string;
  studentId: string;
  studentName: string;
  email: string;
  department: string;
  semester: string;
  degreeProgram: string;
  academicYear: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  ratingTeaching: number;
  ratingContent: number;
  ratingEvaluation: number;
  ratingFacilities: number;
  ratingOverall: number;
  strengths: string;
  improvements: string;
  suggestions?: string;
  createdAt: Date;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface FeedbackData {
  feedbacks: FeedbackItem[];
  pagination: PaginationInfo;
}

// ==================== RESPONSE HANDLER ====================
const sendResponse = (
  statusCode: number,
  message: string,
  data: unknown = null, // Changed from Record<string, unknown> | null to unknown
  errors: ValidationError | null = null
): NextResponse<ApiResponseData> => {
  const response: ApiResponseData = {
    success: statusCode < 400,
    message,
    timestamp: new Date().toISOString(),
    statusCode
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  if (errors && Object.keys(errors).length > 0) {
    response.errors = errors;
  }

  return NextResponse.json(response, { status: statusCode });
};

// ==================== VALIDATION SCHEMAS ====================
const feedbackSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required').max(20, 'Student ID cannot exceed 20 characters'),
  studentName: z.string().min(3, 'Student name must be at least 3 characters').max(100, 'Student name cannot exceed 100 characters'),
  email: z.string().email('Invalid email format').max(100, 'Email cannot exceed 100 characters'),
  department: z.enum([
    'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
    'Electronics & Communication Engineering', 'Computer Science & Engineering',
    'Information Technology', 'Chemical Technology', 'Biomedical Engineering',
    'Aeronautical Engineering', 'Mining Engineering', 'Agricultural Engineering',
    'Other'
  ]),
  semester: z.enum(['1', '2', '3', '4', '5', '6', '7', '8']),
  degreeProgram: z.enum(['B.Tech', 'B.Arch', 'M.Tech', 'MBA', 'PhD']),
  academicYear: z.enum(['2023-24', '2024-25', '2025-26', '2026-27']),
  courseCode: z.string().min(1, 'Course code is required').max(20, 'Course code cannot exceed 20 characters'),
  courseName: z.string().min(1, 'Course name is required').max(100, 'Course name cannot exceed 100 characters'),
  facultyName: z.string().min(1, 'Faculty name is required').max(100, 'Faculty name cannot exceed 100 characters'),
  ratingTeaching: z.coerce.number().int().min(1).max(5),
  ratingContent: z.coerce.number().int().min(1).max(5),
  ratingEvaluation: z.coerce.number().int().min(1).max(5),
  ratingFacilities: z.coerce.number().int().min(1).max(5),
  ratingOverall: z.coerce.number().int().min(1).max(5),
  strengths: z.string().min(10, 'Strengths must be at least 10 characters').max(1000, 'Strengths cannot exceed 1000 characters'),
  improvements: z.string().min(10, 'Improvements must be at least 10 characters').max(1000, 'Improvements cannot exceed 1000 characters'),
  suggestions: z.string().max(1000, 'Suggestions cannot exceed 1000 characters').optional().default(''),
  placementSupport: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  libraryFacilities: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  labFacilities: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  hostelFacilities: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  sportsFacilities: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  careerGuidance: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  extracurricular: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  campusEnvironment: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  adminSupport: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable']).default('Not Applicable'),
  additionalComments: z.string().max(1500, 'Additional comments cannot exceed 1500 characters').optional().default(''),
  recommendImprovements: z.array(z.string()).default([]),
  willingToParticipate: z.boolean().default(false),
  contactForFollowup: z.boolean().default(false)
});

// ==================== VALIDATION FUNCTIONS ====================
const validatePagination = (page: string | null, limit: string | null): PaginationParams => {
  const errors: ValidationError = {};
  let pageNum = 1;
  let limitNum = 10;

  const pageInt = parseInt(page ?? '1', 10);
  const limitInt = parseInt(limit ?? '10', 10);

  if (isNaN(pageInt) || pageInt < 1) {
    errors.page = 'Page must be a positive number';
  } else {
    pageNum = pageInt;
  }

  if (isNaN(limitInt) || limitInt < 1 || limitInt > 100) {
    errors.limit = 'Limit must be between 1 and 100';
  } else {
    limitNum = limitInt;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : null,
    page: pageNum,
    limit: limitNum
  };
};

// ==================== POST - CREATE FEEDBACK ====================
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponseData>> {
  try {
    // Connect to database
    await connectDB();

    // Parse and validate request body
    const body = await request.json() as Record<string, unknown>;
    const validationResult = feedbackSchema.safeParse(body);

    if (!validationResult.success) {
      const errors: ValidationError = {};
      validationResult.error.issues.forEach(issue => {
        const field = issue.path.join('.');
        errors[field] = issue.message;
      });

      return sendResponse(
        400,
        'Validation failed. Please check the errors below.',
        null,
        errors
      );
    }

    const validatedData = validationResult.data;

    // Check for duplicate submissions (same student, course, academic year)
    const existingFeedback = await StudentFeedback.findOne({
      studentId: validatedData.studentId,
      courseCode: validatedData.courseCode,
      academicYear: validatedData.academicYear
    });

    if (existingFeedback) {
      return sendResponse(
        409,
        'Feedback already submitted for this course by this student',
        null,
        { duplicateId: String(existingFeedback._id) }
      );
    }

    // Create new feedback document
    const newFeedback = new StudentFeedback(validatedData);
    const savedFeedback = await newFeedback.save();

    return sendResponse(
      201,
      'Feedback submitted successfully',
      {
        id: String(savedFeedback._id),
        studentId: savedFeedback.studentId,
        courseCode: savedFeedback.courseCode,
        createdAt: savedFeedback.createdAt
      }
    );

  } catch (error: unknown) {
    const err = error as Error & { 
      code?: number; 
      keyPattern?: Record<string, number>; 
      errors?: Record<string, { message: string }> 
    };
    
    console.error('❌ POST error:', err);

    // Handle duplicate key error
    if (err.code === 11000 && err.keyPattern) {
      const field = Object.keys(err.keyPattern)[0];
      return sendResponse(
        409,
        `${field} already exists in the system`,
        null,
        { [field]: `This ${field} is already registered` }
      );
    }

    // Handle validation error
    if (err.name === 'ValidationError' && err.errors) {
      const validationErrors: ValidationError = {};
      Object.keys(err.errors).forEach(key => {
        const errorObj = err.errors?.[key];
        validationErrors[key] = errorObj?.message ?? 'Validation error';
      });
      return sendResponse(400, 'Validation error', null, validationErrors);
    }

    // Generic error
    return sendResponse(
      500,
      'Failed to submit feedback. Please try again later.',
      null,
      { error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' }
    );
  }
}

// ==================== GET - RETRIEVE FEEDBACKS ====================
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponseData>> {
  try {
    await connectDB();

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const department = searchParams.get('department');
    const semester = searchParams.get('semester');
    const academicYear = searchParams.get('academicYear');
    const courseCode = searchParams.get('courseCode');
    const facultyName = searchParams.get('facultyName');
    const sortBy = searchParams.get('sortBy') || '-createdAt';

    // Validate pagination
    const paginationValidation = validatePagination(page, limit);
    if (!paginationValidation.isValid) {
      return sendResponse(
        400,
        'Invalid pagination parameters',
        null,
        paginationValidation.errors
      );
    }

    const pageNum = paginationValidation.page;
    const limitNum = paginationValidation.limit;
    const skip = (pageNum - 1) * limitNum;

    // Build filter object with proper typing
    const filter: Record<string, unknown> = {};

    if (department) {
      filter.department = department;
    }

    if (semester) {
      filter.semester = semester;
    }

    if (academicYear) {
      filter.academicYear = academicYear;
    }

    if (courseCode) {
      filter.courseCode = courseCode;
    }

    if (facultyName) {
      filter.facultyName = { $regex: facultyName, $options: 'i' };
    }

    // Execute queries in parallel with proper type casting
    const [feedbacksResult, total] = await Promise.all([
      StudentFeedback.find(filter)
        .select('-_v -__v')
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      StudentFeedback.countDocuments(filter)
    ]);

    // Transform the result to ensure proper typing
    const feedbacks: FeedbackItem[] = feedbacksResult.map(feedback => ({
      _id: String(feedback._id),
      studentId: feedback.studentId,
      studentName: feedback.studentName,
      email: feedback.email,
      department: feedback.department,
      semester: feedback.semester,
      degreeProgram: feedback.degreeProgram,
      academicYear: feedback.academicYear,
      courseCode: feedback.courseCode,
      courseName: feedback.courseName,
      facultyName: feedback.facultyName,
      ratingTeaching: feedback.ratingTeaching,
      ratingContent: feedback.ratingContent,
      ratingEvaluation: feedback.ratingEvaluation,
      ratingFacilities: feedback.ratingFacilities,
      ratingOverall: feedback.ratingOverall,
      strengths: feedback.strengths,
      improvements: feedback.improvements,
      suggestions: feedback.suggestions || '',
      createdAt: feedback.createdAt
    }));

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    const responseData: FeedbackData = {
      feedbacks,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage,
        hasPreviousPage
      }
    };

    // Fixed: Pass responseData directly without type casting
    return sendResponse(200, 'Feedbacks retrieved successfully', responseData);

  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ GET error:', err);
    return sendResponse(
      500,
      'Failed to retrieve feedbacks. Please try again later.',
      null,
      { error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' }
    );
  }
}


//redeploy

// ==================== OPTIONS - CORS ====================
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}