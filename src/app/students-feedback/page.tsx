"use client";

import React, { useState, useCallback, use } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';


interface FeedbackData {
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
  ratingTeaching: string;
  ratingContent: string;
  ratingEvaluation: string;
  ratingFacilities: string;
  ratingOverall: string;
  strengths: string;
  improvements: string;
  suggestions: string;
  placementSupport: string;
  libraryFacilities: string;
  labFacilities: string;
  hostelFacilities: string;
  sportsFacilities: string;
  careerGuidance: string;
  extracurricular: string;
  campusEnvironment: string;
  adminSupport: string;
  additionalComments: string;
  recommendImprovements: string[];
  willingToParticipate: boolean;
  contactForFollowup: boolean;
}

interface ApiError {
  success?: boolean;
  message?: string;
  errors?: { [key: string]: string };
  error?: string;
  details?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const StudentFeedbackForm: React.FC = () => {
  const initialFormState: FeedbackData = {
    studentId: '',
    studentName: '',
    email: '',
    department: '',
    semester: '',
    degreeProgram: '',
    academicYear: '',
    courseCode: '',
    courseName: '',
    facultyName: '',
    ratingTeaching: '',
    ratingContent: '',
    ratingEvaluation: '',
    ratingFacilities: '',
    ratingOverall: '',
    strengths: '',
    improvements: '',
    suggestions: '',
    placementSupport: '',
    libraryFacilities: '',
    labFacilities: '',
    hostelFacilities: '',
    sportsFacilities: '',
    careerGuidance: '',
    extracurricular: '',
    campusEnvironment: '',
    adminSupport: '',
    additionalComments: '',
    recommendImprovements: [],
    willingToParticipate: false,
    contactForFollowup: false
  };

  const [formData, setFormData] = useState<FeedbackData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  // ==================== VALIDATION ====================
  const validateFormFrontend = (): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};

    // Student Information Validation
    if (!formData.studentId?.trim()) {
      errors.studentId = '✗ Student ID is required';
    }

    if (!formData.studentName?.trim()) {
      errors.studentName = '✗ Student name is required';
    } else if (formData.studentName.length < 3) {
      errors.studentName = '✗ Student name must be at least 3 characters';
    }

    if (!formData.email?.trim()) {
      errors.email = '✗ Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '✗ Invalid email format';
    }

    if (!formData.department) {
      errors.department = '✗ Department is required';
    }

    if (!formData.semester) {
      errors.semester = '✗ Semester is required';
    }

    if (!formData.degreeProgram) {
      errors.degreeProgram = '✗ Degree program is required';
    }

    if (!formData.academicYear) {
      errors.academicYear = '✗ Academic year is required';
    }

    // Course & Faculty Validation
    if (!formData.courseCode?.trim()) {
      errors.courseCode = '✗ Course code is required';
    }

    if (!formData.courseName?.trim()) {
      errors.courseName = '✗ Course name is required';
    }

    if (!formData.facultyName?.trim()) {
      errors.facultyName = '✗ Faculty name is required';
    }

    // Rating Validation
    const ratingFields = [
      'ratingTeaching', 'ratingContent', 'ratingEvaluation', 
      'ratingFacilities', 'ratingOverall'
    ];

    ratingFields.forEach(field => {
      if (!formData[field as keyof FeedbackData]) {
        errors[field] = '✗ This rating is required';
      }
    });

    // Feedback Validation
    if (!formData.strengths?.trim()) {
      errors.strengths = '✗ Please mention strengths';
    } else if (formData.strengths.length < 20) {
      errors.strengths = '✗ Please provide more detailed feedback (min 20 characters)';
    }

    if (!formData.improvements?.trim()) {
      errors.improvements = '✗ Please mention areas for improvement';
    } else if (formData.improvements.length < 20) {
      errors.improvements = '✗ Please provide more detailed feedback (min 20 characters)';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Handle input changes
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox' && name === 'recommendImprovements[]') {
      setFormData(prev => {
        const currentArray = [...prev.recommendImprovements];
        if (checked) {
          return { ...prev, recommendImprovements: [...currentArray, value] };
        } else {
          return {
            ...prev,
            recommendImprovements: currentArray.filter(item => item !== value)
          };
        }
      });
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const router = useRouter();

  // Handle form submission
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   // Frontend validation
  //   const validation = validateFormFrontend();
  //   if (!validation.isValid) {
  //     setValidationErrors(validation.errors);
  //     setSubmitError('❌ Please fix the highlighted errors above');
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //     return;
  //   }

  //   setValidationErrors({});
  //   setIsSubmitting(true);
  //   setSubmitError('');
  //   setSubmitSuccess(false);
  //   setShowSuccessMessage(false);

  //   try {
  //     const response = await axios.post('/api/users/student-feedback', formData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       timeout: 15000,
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       // Log success to console
  //       console.log('✅ Feedback Submitted Successfully!', {
  //         status: response.status,
  //         message: response.data?.message || 'Feedback submitted successfully',
  //         timestamp: new Date().toISOString(),
  //         data: response.data
  //       });

  //       // Set success states
  //       setSubmitSuccess(true);
  //       setShowSuccessMessage(true);
        
  //       // Reset form
  //       setFormData(initialFormState);
  //       setValidationErrors({});
        
  //       // Scroll to top smoothly
  //       window.scrollTo({ 
  //         top: 0, 
  //         behavior: 'smooth' 
  //       });

  //       // Hide success message after 8 seconds
  //       setTimeout(() => {
  //         setShowSuccessMessage(false);
  //       }, 8000);
  //     }
  //   } catch (error) {
  //     const axiosError = error as AxiosError<ApiError>;
      
  //     console.error('❌ Submission Error:', {
  //       status: axiosError.response?.status,
  //       statusText: axiosError.response?.statusText,
  //       message: axiosError.message,
  //       data: axiosError.response?.data,
  //       timestamp: new Date().toISOString()
  //     });

  //     // Scroll to top to show error
  //     window.scrollTo({ 
  //       top: 0, 
  //       behavior: 'smooth' 
  //     });

  //     // Handle backend validation errors
  //     if (axiosError.response?.status === 400 && axiosError.response?.data?.errors) {
  //       setValidationErrors(axiosError.response.data.errors);
  //       setSubmitError('❌ Please fix the errors below and try again');
  //     } else {
  //       const errorMessage = 
  //         axiosError.response?.data?.message ||
  //         axiosError.response?.data?.error ||
  //         axiosError.message ||
  //         'Failed to submit feedback. Please try again.';
  //       setSubmitError(`❌ Error: ${errorMessage}`);
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const router = useRouter();

// ... (existing code)

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Frontend validation
  const validation = validateFormFrontend();
  if (!validation.isValid) {
    setValidationErrors(validation.errors);
    setSubmitError('❌ Please fix the highlighted errors above');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  setIsSubmitting(true);
  setSubmitError('');
  setSubmitSuccess(false);
  setValidationErrors({});

  try {
    const response = await axios.post('/api/users/student-feedback', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    if (response.status === 200 || response.status === 201) {
      // Redirect to thank you page
      router.push('/thankyou');
    }

  } catch (error) {
    // Error handling remains the same
    const axiosError = error as AxiosError<ApiError>;
    
    console.error('❌ Submission Error:', {
      status: axiosError.response?.status,
      message: axiosError.message,
      data: axiosError.response?.data
    });

    if (axiosError.response?.status === 400 && axiosError.response?.data?.errors) {
      setValidationErrors(axiosError.response.data.errors);
      setSubmitError('❌ Please fix the errors below and try again');
    } else {
      const errorMessage = 
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Failed to submit feedback. Please try again.';
      setSubmitError(`❌ Error: ${errorMessage}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    setIsSubmitting(false);
  }
};

  // Render error field component
  const renderFieldError = (fieldName: string) => {
    if (!validationErrors[fieldName]) return null;
    return (
      <p className="text-red-600 text-xs font-semibold mt-2 bg-red-50 p-2 rounded border-l-2 border-red-500">
        {validationErrors[fieldName]}
      </p>
    );
  };

  // Options
  const departments = [
    'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
    'Electronics & Communication Engineering', 'Computer Science & Engineering',
    'Information Technology', 'Chemical Technology', 'Biomedical Engineering',
    'Aeronautical Engineering', 'Mining Engineering', 'Agricultural Engineering',
    'Other'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const degreePrograms = ['B.Tech', 'B.Arch', 'M.Tech', 'MBA', 'PhD'];
  const academicYears = ['2023-24', '2024-25', '2025-26', '2026-27'];
  
  const ratingOptions = [
    { value: '5', label: 'Excellent' },
    { value: '4', label: 'Very Good' },
    { value: '3', label: 'Good' },
    { value: '2', label: 'Average' },
    { value: '1', label: 'Poor' }
  ];

  const improvementAreas = [
    'Teaching Methods', 'Course Content', 'Evaluation System',
    'Library Resources', 'Lab Equipment', 'Hostel Facilities',
    'Sports Facilities', 'Career Guidance', 'Placement Support',
    'Administrative Support', 'Campus Infrastructure', 'Extracurricular Activities'
  ];

  const facilitiesOptions = ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-in-from-top-5 {
          animation: slide-in-from-top 0.5s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-in {
          animation: fade-in 0.3s ease-in;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-blue-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Bihar Engineering University
              </h1>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">Student Feedback System</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Student Feedback Form
              </h1>
              <div className="w-20 h-1 bg-white/50 mx-auto mb-4"></div>
              <p className="text-blue-100 text-lg mb-2">
                Government Engineering College, vaishali
              </p>
              <div className="mt-4 text-sm text-blue-100/90 max-w-2xl mx-auto">
                <p>📝 Your feedback helps us improve academic quality and campus facilities.</p>
                <p className="mt-1">🔒 All responses are anonymous and confidential.</p>
              </div>
            </div>
          </div>

          {/* Success Message - Enhanced */}
          {showSuccessMessage && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 mx-6 mt-6 rounded-r-lg shadow-lg animate-in slide-in-from-top-5">
              <div className="flex items-start gap-4">
                <div className="text-green-500 mt-1 animate-bounce">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-green-800 font-bold text-xl mb-2">
                    ✅ Feedback Submitted Successfully!
                  </p>
                  <p className="text-green-700 text-base leading-relaxed">
                    Thank you for your valuable feedback. Your input helps us enhance the learning experience at BEU. 
                    The administration will review your responses and take necessary actions for improvement.
                  </p>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      🔔 Your feedback has been recorded successfully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mx-6 mt-6 rounded-r-lg shadow-md animate-in slide-in-from-top-5">
              <div className="flex items-start gap-4">
                <div className="text-red-500 mt-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-bold text-lg">Error</p>
                  <p className="text-red-700 text-sm mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* ==================== STUDENT INFORMATION SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                👤 Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.studentId ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="BEU20240001"
                  />
                  {renderFieldError('studentId')}
                </div>

                <div className={validationErrors.studentName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Enter your full name"
                  />
                  {renderFieldError('studentName')}
                </div>

                <div className={validationErrors.email ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="student@beu.ac.in"
                  />
                  {renderFieldError('email')}
                </div>

                <div className={validationErrors.department ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {renderFieldError('department')}
                </div>

                <div className={validationErrors.semester ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Semester --</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                  {renderFieldError('semester')}
                </div>

                <div className={validationErrors.degreeProgram ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Degree Program <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="degreeProgram"
                    value={formData.degreeProgram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Program --</option>
                    {degreePrograms.map((program) => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                  {renderFieldError('degreeProgram')}
                </div>

                <div className={validationErrors.academicYear ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Year --</option>
                    {academicYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {renderFieldError('academicYear')}
                </div>
              </div>
            </section>

            {/* ==================== COURSE & FACULTY SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                📚 Course & Faculty Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.courseCode ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., CS101"
                  />
                  {renderFieldError('courseCode')}
                </div>

                <div className={validationErrors.courseName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Subject Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., Data Structures"
                  />
                  {renderFieldError('courseName')}
                </div>

                <div className={`md:col-span-2 ${validationErrors.facultyName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Faculty Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="facultyName"
                    value={formData.facultyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., Faculty Name"
                  />
                  {renderFieldError('facultyName')}
                </div>
              </div>
            </section>

            {/* ==================== RATING SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                ⭐ Ratings & Feedback
              </h2>
              
              <div className="space-y-6">
                {/* Teaching Quality */}
                <div className={validationErrors.ratingTeaching ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Teaching Quality & Methodology <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <label key={option.value} className="flex flex-col items-center p-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="ratingTeaching"
                          value={option.value}
                          checked={formData.ratingTeaching === option.value}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800 mt-2 text-center">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderFieldError('ratingTeaching')}
                </div>

                {/* Course Content */}
                <div className={validationErrors.ratingContent ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Course Content & Relevance <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <label key={option.value} className="flex flex-col items-center p-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="ratingContent"
                          value={option.value}
                          checked={formData.ratingContent === option.value}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800 mt-2 text-center">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderFieldError('ratingContent')}
                </div>

                {/* Evaluation System */}
                <div className={validationErrors.ratingEvaluation ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Evaluation System & Assessment <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <label key={option.value} className="flex flex-col items-center p-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="ratingEvaluation"
                          value={option.value}
                          checked={formData.ratingEvaluation === option.value}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800 mt-2 text-center">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderFieldError('ratingEvaluation')}
                </div>

                {/* Course Facilities */}
                <div className={validationErrors.ratingFacilities ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Course Facilities (Lab, Resources) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <label key={option.value} className="flex flex-col items-center p-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="ratingFacilities"
                          value={option.value}
                          checked={formData.ratingFacilities === option.value}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800 mt-2 text-center">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderFieldError('ratingFacilities')}
                </div>

                {/* Overall Rating */}
                <div className={validationErrors.ratingOverall ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Overall Course Experience <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <label key={option.value} className="flex flex-col items-center p-3 bg-white/60 rounded-lg border border-blue-200/50 hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="ratingOverall"
                          value={option.value}
                          checked={formData.ratingOverall === option.value}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800 mt-2 text-center">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderFieldError('ratingOverall')}
                </div>
              </div>
            </section>

            {/* ==================== COURSE FEEDBACK SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                💬 Detailed Feedback
              </h2>
              <div className="space-y-6">
                <div className={validationErrors.strengths ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Strengths of this Course <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="strengths"
                    value={formData.strengths}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="What did you like about this course? (teaching, content, faculty, etc.)"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    {formData.strengths.length}/1000 characters
                  </p>
                  {renderFieldError('strengths')}
                </div>

                <div className={validationErrors.improvements ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Areas for Improvement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="improvements"
                    value={formData.improvements}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="What could be improved? (pace, clarity, lab work, assignments, etc.)"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    {formData.improvements.length}/1000 characters
                  </p>
                  {renderFieldError('improvements')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Suggestions for Enhancement
                  </label>
                  <textarea
                    name="suggestions"
                    value={formData.suggestions}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Any specific suggestions you would like to recommend?"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    {formData.suggestions.length}/1000 characters
                  </p>
                </div>
              </div>
            </section>

            {/* ==================== CAMPUS FACILITIES SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                🏫 Campus Facilities & Support
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Library Facilities */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Library Facilities
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="libraryFacilities"
                          value={option}
                          checked={formData.libraryFacilities === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lab Facilities */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Lab Facilities
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="labFacilities"
                          value={option}
                          checked={formData.labFacilities === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Hostel Facilities */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Hostel Facilities
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="hostelFacilities"
                          value={option}
                          checked={formData.hostelFacilities === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sports Facilities */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Sports Facilities
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="sportsFacilities"
                          value={option}
                          checked={formData.sportsFacilities === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Career Guidance */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Career Guidance & Counseling
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="careerGuidance"
                          value={option}
                          checked={formData.careerGuidance === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Extracurricular Activities */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Extracurricular Activities
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="extracurricular"
                          value={option}
                          checked={formData.extracurricular === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Campus Environment */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Campus Environment
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="campusEnvironment"
                          value={option}
                          checked={formData.campusEnvironment === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Administrative Support */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Administrative Support
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="adminSupport"
                          value={option}
                          checked={formData.adminSupport === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Placement Support */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-3">
                    Placement Support & Assistance
                  </label>
                  <div className="space-y-2">
                    {facilitiesOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-blue-100/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="placementSupport"
                          value={option}
                          checked={formData.placementSupport === option}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-blue-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ==================== IMPROVEMENT AREAS SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                🎯 Areas Needing Improvement
              </h2>
              <p className="text-sm text-blue-700 mb-4">
                Select all areas that you think need improvement:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {improvementAreas.map((area) => (
                  <label key={area} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-100/50 transition-colors cursor-pointer border border-blue-200/50 bg-white/60">
                    <input
                      type="checkbox"
                      name="recommendImprovements[]"
                      value={area}
                      checked={formData.recommendImprovements.includes(area)}
                      onChange={handleChange}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-blue-800">{area}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* ==================== GENERAL COMMENTS SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                📋 Additional Comments
              </h2>
              <div>
                <label className="block text-sm font-semibold text-blue-800 mb-2">
                  Any Other Comments or Concerns
                </label>
                <textarea
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleChange}
                  maxLength={1500}
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                  placeholder="Please share any additional feedback, concerns, or observations..."
                />
                <p className="text-xs text-blue-600 mt-1">
                  {formData.additionalComments.length}/1500 characters
                </p>
              </div>
            </section>

            {/* ==================== PARTICIPATION SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                ✅ Participation & Follow-up
              </h2>
              <div className="space-y-4">
                <label className="flex items-start space-x-4 p-4 rounded-lg bg-white/60 border border-blue-200/50 hover:bg-blue-100/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="willingToParticipate"
                    checked={formData.willingToParticipate}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-1 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-blue-800">
                      I'm willing to participate in focus group discussions
                    </span>
                    <p className="text-sm text-blue-600 mt-1">
                      Help us understand issues in greater depth through group discussions
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-4 p-4 rounded-lg bg-white/60 border border-blue-200/50 hover:bg-blue-100/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="contactForFollowup"
                    checked={formData.contactForFollowup}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-1 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-blue-800">
                      I can be contacted for follow-up questions
                    </span>
                    <p className="text-sm text-blue-600 mt-1">
                      We may reach out via email for clarification on your feedback
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* ==================== CONSENT SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <span className="font-semibold">🔒 Data Privacy Notice:</span> Your feedback is confidential and will be used only for improving academic quality and campus facilities at BEU. Your identity will be protected and responses will be analyzed collectively. By submitting this form, you consent to us using your feedback for institutional improvement purposes.
                </p>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed opacity-75'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] hover:shadow-xl focus:ring-4 focus:ring-blue-300'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Feedback...</span>
                  </div>
                ) : (
                  '📤 Submit Feedback'
                )}
              </button>
              <p className="mt-4 text-xs text-blue-600 text-center">
                🔒 Your feedback is confidential and helps us create a better learning environment
              </p>
            </div>
          </form>

          {/* Footer */}
         <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 sm:p-6 md:p-8 border-t border-blue-200">
  <div className="text-center space-y-4 sm:space-y-6">
    {/* Social Links */}
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
      <a href="https://github.com/Suraj1819" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 hover:border-blue-400 transition duration-300 flex items-center justify-center group">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:scale-110 group-hover:text-blue-700 transition fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      <a href="https://www.linkedin.com/in/suraj-kumar-72847b30a/" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 hover:border-blue-400 transition duration-300 flex items-center justify-center group">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:scale-110 group-hover:text-blue-700 transition fill-current" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
        </svg>
      </a>
      <a href="https://x.com/SuraJzRt" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 hover:border-blue-400 transition duration-300 flex items-center justify-center group">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:scale-110 group-hover:text-blue-700 transition fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.07-6.573-5.848 6.573H2.18l7.732-8.835L1.254 2.25h6.554l4.596 6.084 5.308-6.084zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a href="https://leetcode.com/u/Suraj_1819/" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 hover:border-blue-400 transition duration-300 flex items-center justify-center group">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:scale-110 group-hover:text-blue-700 transition fill-current" viewBox="0 0 24 24">
          <path d="M16.102 17.93h-2.697v5.57h2.697v-5.57zM15.795 13.91h-2.66v4.02h2.66v-4.02zm5.539 9.5h-2.694v-5.932h2.694v5.932zM4.487 12.557h2.694V3.05H4.487v9.507zm11.311 1.155h2.697v-4.882h-2.697v4.882zm-13.993-1.155h2.697v-4.882H1.805v4.882z"/>
        </svg>
      </a>
      <a href="https://www.instagram.com/risu2948/" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 hover:border-blue-400 transition duration-300 flex items-center justify-center group">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:scale-110 group-hover:text-blue-700 transition fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
        </svg>
      </a>
      <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 hover:border-blue-400 transition duration-300 flex items-center justify-center group">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-hover:scale-110 group-hover:text-blue-700 transition fill-current" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.294.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.098.246.198.373.295a.077.077 0 0 1-.007.127 12.299 12.299 0 0 1-1.871.892.076.076 0 0 0-.041.107c.36.699.772 1.365 1.225 1.994a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.057c.5-4.718-.838-8.812-3.54-12.46a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.934-2.157 2.157-2.157 1.226 0 2.157.964 2.157 2.157 0 1.19-.93 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.934-2.157 2.157-2.157 1.226 0 2.157.964 2.157 2.157 0 1.19-.931 2.155-2.157 2.155z"/>
        </svg>
      </a>
    </div>

    {/* Made with Love */}
    <div className="pt-3 sm:pt-4 border-t border-blue-200">
      <p className="text-xs sm:text-sm text-blue-800">
        Made with <span className="inline-block text-red-500 text-base sm:text-lg animate-pulse">❤️</span> by{' '}
        <a 
          href="https://surajz.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 cursor-pointer"
        >
          SuraJz
        </a>
      </p>
      <p className="text-xs text-blue-500 mt-2">
        © 2024 Government Engineering College, Vaishali | All rights reserved
      </p>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedbackForm;