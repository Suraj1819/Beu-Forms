// app/api/job-notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import JobNotification from '@/models/jobNotificationModel';
import { connectDB } from '@/dbconfig/dbconfig';

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
  data?: any;
  errors?: ValidationError | null;
  timestamp: string;
  statusCode?: number;
}

interface PaginatedResponse {
  notifications: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ==================== RESPONSE HANDLER ====================
const sendResponse = (
  statusCode: number,
  message: string,
  data: any = null,
  errors: ValidationError | null = null
): NextResponse<ApiResponseData> => {
  const response: ApiResponseData = {
    success: statusCode < 400,
    message,
    timestamp: new Date().toISOString(),
    statusCode
  };

  if (data) {
    response.data = data;
  }

  if (errors && Object.keys(errors).length > 0) {
    response.errors = errors;
  }

  return NextResponse.json(response, { status: statusCode });
};

// ==================== REGEX PATTERNS ====================
const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9\s\-.,()]+$/
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
  return REGEX_PATTERNS.email.test(email);
};

/**
 * Validate phone number format
 */
const isValidPhone = (phone: string): boolean => {
  return REGEX_PATTERNS.phone.test(phone);
};

/**
 * Validate URL format
 */
const isValidUrl = (url: string): boolean => {
  return REGEX_PATTERNS.url.test(url);
};

/**
 * Sanitize string input
 */
const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Validate company information
 */
const validateCompanyInfo = (body: any): ValidationError => {
  const errors: ValidationError = {};

  // Email validation
  if (!body.email || !isValidEmail(body.email)) {
    errors.email = 'Valid email is required (e.g., company@domain.com)';
  }

  // Company name validation
  if (!body.companyName || body.companyName.trim().length === 0) {
    errors.companyName = 'Company name is required';
  } else if (body.companyName.length > 200) {
    errors.companyName = 'Company name cannot exceed 200 characters';
  } else if (body.companyName.length < 3) {
    errors.companyName = 'Company name must be at least 3 characters';
  }

  // About company validation
  if (!body.aboutCompany || body.aboutCompany.trim().length === 0) {
    errors.aboutCompany = 'About company description is required';
  } else if (body.aboutCompany.length > 2000) {
    errors.aboutCompany = 'About company cannot exceed 2000 characters';
  } else if (body.aboutCompany.length < 20) {
    errors.aboutCompany = 'About company must be at least 20 characters';
  }

  // Correspondence address validation
  if (!body.correspondenceAddress || body.correspondenceAddress.trim().length === 0) {
    errors.correspondenceAddress = 'Correspondence address is required';
  } else if (body.correspondenceAddress.length > 500) {
    errors.correspondenceAddress = 'Correspondence address cannot exceed 500 characters';
  } else if (body.correspondenceAddress.length < 10) {
    errors.correspondenceAddress = 'Correspondence address must be at least 10 characters';
  }

  // Website validation
  if (!body.website || !isValidUrl(body.website)) {
    errors.website = 'Valid website URL is required (e.g., https://www.company.com)';
  }

  // Type of organization validation
  const validOrgTypes = [
    'Private', 'MNC(Indian Origin)', 'MNC(Foreign Origin)',
    'Government', 'PSUs', 'NGO', 'STARTUP', 'Other'
  ];
  if (!body.typeOfOrganization || !validOrgTypes.includes(body.typeOfOrganization)) {
    errors.typeOfOrganization = 'Valid type of organization is required';
  }

  // MNC head office validation (if applicable)
  if ((body.typeOfOrganization === 'MNC(Indian Origin)' || 
       body.typeOfOrganization === 'MNC(Foreign Origin)') &&
      (!body.mncHeadOffice || body.mncHeadOffice.trim().length === 0)) {
    errors.mncHeadOffice = 'MNC head office location is required';
  }

  // Nature of business validation
  if (!Array.isArray(body.natureOfBusiness) || body.natureOfBusiness.length === 0) {
    errors.natureOfBusiness = 'Select at least one nature of business';
  }

  // Date of establishment validation (optional)
  if (body.dateOfEstablishment) {
    const date = new Date(body.dateOfEstablishment);
    if (isNaN(date.getTime())) {
      errors.dateOfEstablishment = 'Invalid date format';
    }
  }

  // Number of employees validation (optional)
  if (body.numberOfEmployees) {
    const employees = parseInt(body.numberOfEmployees);
    if (isNaN(employees) || employees < 1) {
      errors.numberOfEmployees = 'Number of employees must be a positive number';
    }
  }

  return errors;
};

/**
 * Validate HR & Contact information
 */
const validateHRInfo = (body: any): ValidationError => {
  const errors: ValidationError = {};

  // Head HR validation
  if (!body.headHRName || body.headHRName.trim().length === 0) {
    errors.headHRName = 'Head HR name is required';
  } else if (body.headHRName.length > 150) {
    errors.headHRName = 'Head HR name cannot exceed 150 characters';
  }

  if (!body.headHRContact || !isValidPhone(body.headHRContact)) {
    errors.headHRContact = 'Valid 10-15 digit contact number is required';
  }

  if (!body.headHREmail || !isValidEmail(body.headHREmail)) {
    errors.headHREmail = 'Valid Head HR email is required';
  }

  // First contact validation
  if (!body.firstContactName || body.firstContactName.trim().length === 0) {
    errors.firstContactName = 'First contact name is required';
  } else if (body.firstContactName.length > 150) {
    errors.firstContactName = 'First contact name cannot exceed 150 characters';
  }

  if (!body.firstContactEmail || !isValidEmail(body.firstContactEmail)) {
    errors.firstContactEmail = 'Valid first contact email is required';
  }

  if (!body.firstContactPhone || !isValidPhone(body.firstContactPhone)) {
    errors.firstContactPhone = 'Valid first contact phone is required';
  }

  // Second contact validation
  if (!body.secondContactName || body.secondContactName.trim().length === 0) {
    errors.secondContactName = 'Second contact name is required';
  } else if (body.secondContactName.length > 150) {
    errors.secondContactName = 'Second contact name cannot exceed 150 characters';
  }

  if (!body.secondContactEmail || !isValidEmail(body.secondContactEmail)) {
    errors.secondContactEmail = 'Valid second contact email is required';
  }

  if (!body.secondContactPhone || !isValidPhone(body.secondContactPhone)) {
    errors.secondContactPhone = 'Valid second contact phone is required';
  }

  return errors;
};

/**
 * Validate job details
 */
const validateJobDetails = (body: any): ValidationError => {
  const errors: ValidationError = {};

  if (!body.jobProfile || body.jobProfile.trim().length === 0) {
    errors.jobProfile = 'Job profile is required';
  } else if (body.jobProfile.length > 200) {
    errors.jobProfile = 'Job profile cannot exceed 200 characters';
  }

  if (!body.jobTitle || body.jobTitle.trim().length === 0) {
    errors.jobTitle = 'Job title is required';
  } else if (body.jobTitle.length > 200) {
    errors.jobTitle = 'Job title cannot exceed 200 characters';
  }

  if (!body.jobDescription || body.jobDescription.trim().length === 0) {
    errors.jobDescription = 'Job description is required';
  } else if (body.jobDescription.length > 2000) {
    errors.jobDescription = 'Job description cannot exceed 2000 characters';
  } else if (body.jobDescription.length < 30) {
    errors.jobDescription = 'Job description must be at least 30 characters';
  }

  const minHires = parseInt(body.minHires);
  if (isNaN(minHires) || minHires < 0) {
    errors.minHires = 'Valid minimum hires (non-negative number) is required';
  }

  const expectedHires = parseInt(body.expectedHires);
  if (isNaN(expectedHires) || expectedHires < minHires) {
    errors.expectedHires = 'Expected hires must be greater than or equal to minimum hires';
  }

  if (!body.jobLocation || body.jobLocation.trim().length === 0) {
    errors.jobLocation = 'Job location is required';
  } else if (body.jobLocation.length > 300) {
    errors.jobLocation = 'Job location cannot exceed 300 characters';
  }

  if (!body.requiredSkills || body.requiredSkills.trim().length === 0) {
    errors.requiredSkills = 'Required skills are required';
  } else if (body.requiredSkills.length > 1500) {
    errors.requiredSkills = 'Required skills cannot exceed 1500 characters';
  }

  return errors;
};

/**
 * Validate eligibility criteria
 */
const validateEligibility = (body: any): ValidationError => {
  const errors: ValidationError = {};

  const validDegrees = [
    'B. Tech(4 years)', 'B.Arch(5 years)', 'M.Tech (2 years)', 'MBA', 'PhD'
  ];

  if (!Array.isArray(body.eligibleDegrees) || body.eligibleDegrees.length === 0) {
    errors.eligibleDegrees = 'Select at least one eligible degree';
  } else {
    const invalidDegrees = body.eligibleDegrees.filter((d: string) => !validDegrees.includes(d));
    if (invalidDegrees.length > 0) {
      errors.eligibleDegrees = 'Invalid degree(s) selected';
    }
  }

  if (!Array.isArray(body.eligibleBTechDepartments) || body.eligibleBTechDepartments.length === 0) {
    errors.eligibleBTechDepartments = 'Select at least one B.Tech department';
  }

  if (!Array.isArray(body.eligibleMTechDepartments) || body.eligibleMTechDepartments.length === 0) {
    errors.eligibleMTechDepartments = 'Select at least one M.Tech department';
  }

  if (!Array.isArray(body.eligiblePhDDepartments) || body.eligiblePhDDepartments.length === 0) {
    errors.eligiblePhDDepartments = 'Select at least one PhD department';
  }

  return errors;
};

/**
 * Validate role-specific details
 */
const validateRoleSpecific = (body: any): ValidationError => {
  const errors: ValidationError = {};

  // B.Tech validation
  if (!body.jobDesignationBTech || body.jobDesignationBTech.trim().length === 0) {
    errors.jobDesignationBTech = 'B.Tech job designation is required';
  } else if (body.jobDesignationBTech.length > 200) {
    errors.jobDesignationBTech = 'B.Tech job designation cannot exceed 200 characters';
  }

  if (!body.jobDescBTech || body.jobDescBTech.trim().length === 0) {
    errors.jobDescBTech = 'B.Tech job description is required';
  } else if (body.jobDescBTech.length > 1000) {
    errors.jobDescBTech = 'B.Tech job description cannot exceed 1000 characters';
  } else if (body.jobDescBTech.length < 20) {
    errors.jobDescBTech = 'B.Tech job description must be at least 20 characters';
  }

  // M.Tech validation
  if (!body.jobDesignationMTech || body.jobDesignationMTech.trim().length === 0) {
    errors.jobDesignationMTech = 'M.Tech job designation is required';
  } else if (body.jobDesignationMTech.length > 200) {
    errors.jobDesignationMTech = 'M.Tech job designation cannot exceed 200 characters';
  }

  if (!body.jobDescMTech || body.jobDescMTech.trim().length === 0) {
    errors.jobDescMTech = 'M.Tech job description is required';
  } else if (body.jobDescMTech.length > 1000) {
    errors.jobDescMTech = 'M.Tech job description cannot exceed 1000 characters';
  } else if (body.jobDescMTech.length < 20) {
    errors.jobDescMTech = 'M.Tech job description must be at least 20 characters';
  }

  // PhD validation
  if (!body.jobDesignationPhD || body.jobDesignationPhD.trim().length === 0) {
    errors.jobDesignationPhD = 'PhD job designation is required';
  } else if (body.jobDesignationPhD.length > 200) {
    errors.jobDesignationPhD = 'PhD job designation cannot exceed 200 characters';
  }

  if (!body.jobDescPhD || body.jobDescPhD.trim().length === 0) {
    errors.jobDescPhD = 'PhD job description is required';
  } else if (body.jobDescPhD.length > 1000) {
    errors.jobDescPhD = 'PhD job description cannot exceed 1000 characters';
  } else if (body.jobDescPhD.length < 20) {
    errors.jobDescPhD = 'PhD job description must be at least 20 characters';
  }

  return errors;
};

/**
 * Validate selection process
 */
const validateSelectionProcess = (body: any): ValidationError => {
  const errors: ValidationError = {};

  if (!body.cgpaCutoff || body.cgpaCutoff.trim().length === 0) {
    errors.cgpaCutoff = 'CGPA cutoff is required';
  } else if (body.cgpaCutoff.length > 100) {
    errors.cgpaCutoff = 'CGPA cutoff cannot exceed 100 characters';
  }

  const validBacklogEligibility = ['Yes', 'No'];
  if (!body.backlogEligibility || !validBacklogEligibility.includes(body.backlogEligibility)) {
    errors.backlogEligibility = 'Backlog eligibility must be Yes or No';
  }

  const validModeOfSelection = ['Virtual', 'Campus Visit', 'Hybrid'];
  if (!body.modeOfSelection || !validModeOfSelection.includes(body.modeOfSelection)) {
    errors.modeOfSelection = 'Valid mode of selection is required (Virtual, Campus Visit, or Hybrid)';
  }

  const totalRounds = parseInt(body.totalRounds);
  if (isNaN(totalRounds) || totalRounds < 1 || totalRounds > 10) {
    errors.totalRounds = 'Total rounds must be between 1 and 10';
  }

  if (!Array.isArray(body.selectionRounds) || body.selectionRounds.length === 0) {
    errors.selectionRounds = 'Select at least one selection round';
  } else if (body.selectionRounds.length > totalRounds) {
    errors.selectionRounds = 'Number of selection rounds cannot exceed total rounds';
  }

  // Optional: Syllabus validation
  if (body.syllabus && body.syllabus.length > 2000) {
    errors.syllabus = 'Syllabus cannot exceed 2000 characters';
  }

  return errors;
};

/**
 * Main validation function
 */
const validateJobNotification = (body: any) => {
  const companyErrors = validateCompanyInfo(body);
  const hrErrors = validateHRInfo(body);
  const jobErrors = validateJobDetails(body);
  const eligibilityErrors = validateEligibility(body);
  const roleErrors = validateRoleSpecific(body);
  const selectionErrors = validateSelectionProcess(body);

  const allErrors = {
    ...companyErrors,
    ...hrErrors,
    ...jobErrors,
    ...eligibilityErrors,
    ...roleErrors,
    ...selectionErrors
  };

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: Object.keys(allErrors).length > 0 ? allErrors : null
  };
};

/**
 * Validate pagination parameters
 */
const validatePagination = (page: any, limit: any): PaginationParams => {
  let errors: ValidationError = {};
  let pageNum = 1;
  let limitNum = 10;

  const pageInt = parseInt(page) || 1;
  const limitInt = parseInt(limit) || 10;

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

/**
 * Validate search and filter parameters
 */
const validateSearchParams = (status?: string, companyName?: string, sortBy?: string) => {
  const errors: ValidationError = {};
  const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'On Hold'];
  const validSortFields = [
    'submissionDate', '-submissionDate',
    'companyName', '-companyName',
    'email', '-email'
  ];

  if (status && !validStatuses.includes(status)) {
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
  }

  if (companyName && companyName.length > 200) {
    errors.companyName = 'Company name search cannot exceed 200 characters';
  }

  if (sortBy && !validSortFields.includes(sortBy)) {
    errors.sortBy = `Sort field must be one of: ${validSortFields.join(', ')}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : null
  };
};

// ==================== POST - CREATE ====================
/**
 * POST /api/job-notifications
 * Create a new job notification
 */
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate incoming data
    const validation = validateJobNotification(body);
    if (!validation.isValid) {
      return sendResponse(
        400,
        'Validation failed. Please check the errors below.',
        null,
        validation.errors
      );
    }

    // Check for duplicate email
    const existingNotification = await JobNotification.findOne({ email: body.email });
    if (existingNotification) {
      return sendResponse(
        409,
        'Email already registered. Please use a different email address.',
        null,
        { email: 'This email is already registered in the system' }
      );
    }

    // Sanitize input data
    const sanitizedData = {
      ...body,
      companyName: sanitizeString(body.companyName),
      email: body.email.toLowerCase().trim(),
      aboutCompany: sanitizeString(body.aboutCompany),
      correspondenceAddress: sanitizeString(body.correspondenceAddress),
      headHRName: sanitizeString(body.headHRName),
      firstContactName: sanitizeString(body.firstContactName),
      secondContactName: sanitizeString(body.secondContactName),
      jobProfile: sanitizeString(body.jobProfile),
      jobTitle: sanitizeString(body.jobTitle),
      submissionDate: new Date(),
      status: 'Pending'
    };

    // Create new job notification
    const jobNotification = new JobNotification(sanitizedData);
    const savedNotification = await jobNotification.save();

    console.log(`✅ Job notification created: ${savedNotification._id}`);

    return sendResponse(
      201,
      'Job notification created successfully. Our team will review and contact you soon.',
      {
        id: savedNotification._id,
        email: savedNotification.email,
        companyName: savedNotification.companyName,
        submissionDate: savedNotification.submissionDate
      }
    );

  } catch (error: any) {
    console.error('❌ POST error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return sendResponse(
        409,
        `${field} already exists in the system`,
        null,
        { [field]: `This ${field} is already registered` }
      );
    }

    // Handle validation error
    if (error.name === 'ValidationError') {
      const validationErrors: ValidationError = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      return sendResponse(400, 'Validation error', null, validationErrors);
    }

    // Generic error
    return sendResponse(
      500,
      'Failed to create job notification. Please try again later.',
      null,
      { error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' }
    );
  }
}

// ==================== GET ALL ====================
/**
 * GET /api/job-notifications
 * Retrieve all job notifications with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const status = searchParams.get('status');
    const companyName = searchParams.get('companyName');
    const sortBy = searchParams.get('sortBy') || '-submissionDate';

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

    // Validate search parameters
    const searchValidation = validateSearchParams(status || undefined, companyName || undefined, sortBy);
    if (!searchValidation.isValid) {
      return sendResponse(
        400,
        'Invalid search parameters',
        null,
        searchValidation.errors
      );
    }

    const pageNum = paginationValidation.page;
    const limitNum = paginationValidation.limit;
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (companyName) {
      filter.companyName = { $regex: companyName, $options: 'i' };
    }

    // Execute queries in parallel
    const [notifications, total] = await Promise.all([
      JobNotification.find(filter)
        .select('-_v') // Exclude version field
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      JobNotification.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    return sendResponse(200, 'Job notifications retrieved successfully', {
      notifications,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage,
        hasPreviousPage
      }
    });

  } catch (error: any) {
    console.error('❌ GET error:', error);
    return sendResponse(
      500,
      'Failed to retrieve job notifications. Please try again later.',
      null,
      { error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' }
    );
  }
}

// ==================== OPTIONS - CORS ====================
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}