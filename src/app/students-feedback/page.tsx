"use client";

import React, { useState, useCallback, useEffect } from 'react';
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
  errors?: Record<string, string[]>;
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
  const [submitError, setSubmitError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const validateFormFrontend = (): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};

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

    if (!formData.courseCode?.trim()) {
      errors.courseCode = '✗ Course code is required';
    }

    if (!formData.courseName?.trim()) {
      errors.courseName = '✗ Course name is required';
    }

    if (!formData.facultyName?.trim()) {
      errors.facultyName = '✗ Faculty name is required';
    }

    const ratingFields = [
      'ratingTeaching', 'ratingContent', 'ratingEvaluation', 
      'ratingFacilities', 'ratingOverall'
    ];

    ratingFields.forEach(field => {
      if (!formData[field as keyof FeedbackData]) {
        errors[field] = '✗ This rating is required';
      }
    });

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

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        router.push('/thankyou');
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessMessage, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateFormFrontend();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setSubmitError('❌ Please fix the highlighted errors above');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setValidationErrors({});

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users/student-feedback`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

      if (response.status === 200 || response.status === 201) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowSuccessMessage(true);
        return;
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      
      console.error('❌ Submission Error:', {
        status: axiosError.response?.status,
        message: axiosError.message,
        data: axiosError.response?.data
      });

      if (axiosError.response?.status === 400 && axiosError.response?.data?.errors) {
        const backendErrors: ValidationErrors = {};
        Object.entries(axiosError.response.data.errors).forEach(([key, value]) => {
          backendErrors[key] = value[0];
        });
        setValidationErrors(backendErrors);
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

  const renderFieldError = (fieldName: string) => {
    if (!validationErrors[fieldName]) return null;
    return (
      <p className="text-red-600 text-xs font-semibold mt-2 bg-red-100 p-2 rounded border-l-2 border-red-500">
        {validationErrors[fieldName]}
      </p>
    );
  };

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
    <div className="min-h-screen bg-gray-100 text-gray-900">
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
        .slide-in-from-top {
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

      <nav className="bg-white shadow border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-700">
                Bihar Engineering University
              </h1>
              <p className="text-sm text-blue-500 mt-1">Student Feedback System</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-blue-700 text-white p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-3">
                Student Feedback Form
              </h1>
              <div className="w-20 h-1 bg-blue-300 mx-auto mb-4"></div>
              <p className="text-blue-100 text-lg mb-2">
                Government Engineering College, Vaishali
              </p>
              <div className="mt-4 text-sm text-blue-50 max-w-2xl mx-auto">
                <p>📝 Your feedback helps us improve academic quality and campus facilities.</p>
                <p className="mt-1">🔒 All responses are anonymous and confidential.</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-100 border-l-4 border-red-500 p-6 mx-6 mt-6 rounded shadow animate-in slide-in-from-top">
              <div className="flex items-start gap-4">
                <div className="text-red-600 mt-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-700 font-bold text-lg">Error</p>
                  <p className="text-red-600 text-sm mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 p-6 mx-6 mt-6 rounded shadow animate-in slide-in-from-top">
              <div className="flex items-start gap-4">
                <div className="text-green-600 mt-1">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-green-700 font-bold text-xl mb-2">
                    ✅ Feedback Submitted Successfully!
                  </p>
                  <p className="text-green-600 text-base leading-relaxed">
                    Thank you for your valuable feedback for <strong>Government Engineering College, Vaishali</strong>! 
                    Your input will help us improve the academic and campus facilities.
                  </p>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-300">
                    <p className="text-sm text-green-700 font-medium">
                      🔔 You will be redirected to the thank-you page shortly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8" aria-disabled={showSuccessMessage}>
            {/* STUDENT INFORMATION SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-200">
                👤 Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.studentId ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Registration Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
                    placeholder="BEU20240001"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  {renderFieldError('studentId')}
                </div>

                <div className={validationErrors.studentName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
                    placeholder="Enter your full name"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  {renderFieldError('studentName')}
                </div>

                <div className={validationErrors.email ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
                    placeholder="student@beu.ac.in"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  {renderFieldError('email')}
                </div>

                <div className={validationErrors.department ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Department <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                    disabled={showSuccessMessage || isSubmitting}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {renderFieldError('department')}
                </div>

                <div className={validationErrors.semester ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Semester <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                    disabled={showSuccessMessage || isSubmitting}
                  >
                    <option value="">-- Select Semester --</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                  {renderFieldError('semester')}
                </div>

                <div className={validationErrors.degreeProgram ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Degree Program <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="degreeProgram"
                    value={formData.degreeProgram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                    disabled={showSuccessMessage || isSubmitting}
                  >
                    <option value="">-- Select Program --</option>
                    {degreePrograms.map((program) => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                  {renderFieldError('degreeProgram')}
                </div>

                <div className={validationErrors.academicYear ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Academic Year <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                    disabled={showSuccessMessage || isSubmitting}
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

            {/* COURSE & FACULTY SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-200">
                📚 Course & Faculty Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.courseCode ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Course Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
                    placeholder="e.g., CS101"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  {renderFieldError('courseCode')}
                </div>

                <div className={validationErrors.courseName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Subject Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
                    placeholder="e.g., Data Structures"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  {renderFieldError('courseName')}
                </div>

                <div className={validationErrors.facultyName ? 'ring-2 ring-red-500 p-4 rounded-lg md:col-span-2' : 'md:col-span-2'}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Faculty Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="facultyName"
                    value={formData.facultyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all"
                    placeholder="e.g., Faculty Name"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  {renderFieldError('facultyName')}
                </div>
              </div>
            </section>

            {/* RATING SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-200">
                ⭐ Ratings & Feedback
              </h2>
              <div className="space-y-6">
                {(['ratingTeaching', 'ratingContent', 'ratingEvaluation', 'ratingFacilities', 'ratingOverall'] as const).map((field) => {
                  const labels = {
                    ratingTeaching: 'Teaching Quality & Methodology',
                    ratingContent: 'Course Content & Relevance',
                    ratingEvaluation: 'Evaluation System & Assessment',
                    ratingFacilities: 'Course Facilities (Lab, Resources)',
                    ratingOverall: 'Overall Course Experience'
                  };
                  return (
                    <div key={field} className={validationErrors[field] ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-blue-700 mb-3">
                        {labels[field]} <span className="text-red-600">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {ratingOptions.map((option) => (
                          <label key={option.value} className="flex flex-col items-center p-3 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                            <input
                              type="radio"
                              name={field}
                              value={option.value}
                              checked={formData[field] === option.value}
                              onChange={handleChange}
                              className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              disabled={showSuccessMessage || isSubmitting}
                            />
                            <span className="text-sm text-blue-700 mt-2 text-center">{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {renderFieldError(field)}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* COURSE FEEDBACK SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-200">
                💬 Detailed Feedback
              </h2>
              <div className="space-y-6">
                <div className={validationErrors.strengths ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Strengths of this Course <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="strengths"
                    value={formData.strengths}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all resize-none"
                    placeholder="What did you like about this course? (teaching, content, faculty, etc.)"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.strengths.length}/1000 characters
                  </p>
                  {renderFieldError('strengths')}
                </div>

                <div className={validationErrors.improvements ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Areas for Improvement <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="improvements"
                    value={formData.improvements}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all resize-none"
                    placeholder="What could be improved? (pace, clarity, lab work, assignments, etc.)"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.improvements.length}/1000 characters
                  </p>
                  {renderFieldError('improvements')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Suggestions for Enhancement
                  </label>
                  <textarea
                    name="suggestions"
                    value={formData.suggestions}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all resize-none"
                    placeholder="Any specific suggestions you would like to recommend?"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.suggestions.length}/1000 characters
                  </p>
                </div>
              </div>
            </section>

            {/* CAMPUS FACILITIES SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-200">
                🏫 Campus Facilities & Support
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {([
                  { name: 'libraryFacilities', label: 'Library Facilities' },
                  { name: 'labFacilities', label: 'Lab Facilities' },
                  { name: 'hostelFacilities', label: 'Hostel Facilities' },
                  { name: 'sportsFacilities', label: 'Sports Facilities' },
                  { name: 'careerGuidance', label: 'Career Guidance & Counseling' },
                  { name: 'extracurricular', label: 'Extracurricular Activities' },
                  { name: 'campusEnvironment', label: 'Campus Environment' },
                  { name: 'adminSupport', label: 'Administrative Support' },
                  { name: 'placementSupport', label: 'Placement Support & Assistance' }
                ] as const).map(({ name, label }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-blue-700 mb-3">
                      {label}
                    </label>
                    <div className="space-y-2">
                      {facilitiesOptions.map((option) => (
                        <label key={option} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300 bg-gray-100">
                          <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={formData[name] === option}
                            onChange={handleChange}
                            className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            disabled={showSuccessMessage || isSubmitting}
                          />
                          <span className="text-sm text-blue-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* IMPROVEMENT AREAS SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-200">
                🎯 Areas Needing Improvement
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Select all areas that you think need improvement:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {improvementAreas.map((area) => (
                  <label key={area} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300 bg-gray-100">
                    <input
                      type="checkbox"
                      name="recommendImprovements[]"
                      value={area}
                      checked={formData.recommendImprovements.includes(area)}
                      onChange={handleChange}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      disabled={showSuccessMessage || isSubmitting}
                    />
                    <span className="text-sm font-medium text-blue-700">{area}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* GENERAL COMMENTS SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-200">
                📋 Additional Comments
              </h2>
              <div>
                <label className="block text-sm font-semibold text-blue-700 mb-2">
                  Any Other Comments or Concerns
                </label>
                <textarea
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleChange}
                  maxLength={1500}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all resize-none"
                  placeholder="Please share any additional feedback, concerns, or observations..."
                  disabled={showSuccessMessage || isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.additionalComments.length}/1500 characters
                </p>
              </div>
            </section>

            {/* PARTICIPATION SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-200">
                ✅ Participation & Follow-up
              </h2>
              <div className="space-y-4">
                <label className="flex items-start space-x-4 p-4 rounded-lg bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="willingToParticipate"
                    checked={formData.willingToParticipate}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-1 cursor-pointer"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  <div>
                    <span className="font-semibold text-blue-700">
                      {"I'm willing to participate in focus group discussions"}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Help us understand issues in greater depth through group discussions
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-4 p-4 rounded-lg bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="contactForFollowup"
                    checked={formData.contactForFollowup}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-1 cursor-pointer"
                    disabled={showSuccessMessage || isSubmitting}
                  />
                  <div>
                    <span className="font-semibold text-blue-700">
                      I can be contacted for follow-up questions
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      We may reach out via email for clarification on your feedback
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* CONSENT SECTION */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="bg-gray-200 p-4 rounded-lg border border-gray-300">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold">🔒 Data Privacy Notice:</span> Your feedback is confidential and will be used only for improving academic quality and campus facilities at BEU. Your identity will be protected and responses will be analyzed collectively. By submitting this form, you consent to us using your feedback for institutional improvement purposes.
                </p>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting || showSuccessMessage}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:cursor-pointer ${
                  isSubmitting || showSuccessMessage
                    ? 'bg-gray-400 cursor-not-allowed opacity-75'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-blue-300'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Feedback...</span>
                  </div>
                ) : showSuccessMessage ? (
                  '✅ Feedback Submitted!'
                ) : (
                  '📤 Submit Feedback'
                )}
              </button>
              <p className="mt-4 text-xs text-gray-600 text-center">
                🔒 Your feedback is confidential and helps us create a better learning environment
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-100 p-6 border-t border-gray-200">
            <div className="text-center space-y-4">
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://github.com/Suraj1819" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600 transition-all duration-300 hover:scale-105" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.239 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/suraj-kumar-72847b30a/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600 transition-all duration-300 hover:scale-105" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                </a>
                <a href="https://x.com/SuraJzRt" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600 transition-all duration-300 hover:scale-105" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.07-6.573-5.848 6.573H2.18l7.732-8.835L1.254 2.25h6.554l4.596 6.084 5.308-6.084zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://leetcode.com/u/Suraj_1819/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.102 17.93h-2.697v5.57h2.697v-5.57zM15.795 13.91h-2.66v4.02h2.66v-4.02zm5.539 9.5h-2.694v-5.932h2.694v5.932zM4.487 12.557h2.694V3.05H4.487v9.507zm11.311 1.155h2.697v-4.882h-2.697v4.882zm-13.993-1.155h2.697v-4.882H1.805v4.882z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/risu2948/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600 transition-all duration-300 hover:scale-105" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.227-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.85.069-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.059-1.265-.073-1.689-.073-4.849 0-3.259.013-3.668.07-4.948.2-4.358 2.618-6.78 6.98-6.98 1.281-.058 1.689-.072 4.948-.072 3.259 0 3.668.014 4.948.072 4.354.2 6.782 2.618 6.979 6.98.059 1.28.073 1.689.073 4.948 0 3.259-.014 3.668-.072 4.948-.196 4.354-2.617 6.78-6.979 6.98-1.281.059-1.69.073-4.949.073-3.259 0-3.667-.014-4.947-.072-4.358-.2-6.78-2.618-6.98-6.98-.059-1.281-.073-1.69-.073-4.949 0-3.204.013-3.667.07-4.947.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.204-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                  </svg>
                </a>
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600 transition-all duration-300 hover:scale-105" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.294.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.098.246.198.373.295a.077.077 0 0 1-.007.127 12.299 12.299 0 0 1-1.871.892.076.076 0 0 0-.041.107c.36.699.772 1.365 1.225 1.994a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.057c.5-4.718-.838-8.812-3.54-12.46a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.934-2.157 2.157-2.157 1.226 0 2.157.964 2.157 2.157 0 1.19-.93 2.155-2.157 2.155z"/>
                  </svg>
                </a>
              </div>

              <div className="pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600">
                  Made with <span className="inline-block text-red-600 text-lg animate-bounce">❤️</span> by{' '}
                  <a 
                    href="https://surajz.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-blue-700 hover:text-blue-800 transition duration-300"
                  >
                    SuraJz
                  </a>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  © 2025 Government Engineering College, Vaishali | All rights reserved
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