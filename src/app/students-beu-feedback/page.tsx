"use client";

import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface FormData {
  studentEmail: string;
  studentName: string;
  enrollmentNumber: string;
  branch: string;
  semester: string;
  academicYear: string;
  companyName: string;
  positionApplied: string;
  overallExperience: string;
  recruitmentProcess: string;
  
  // Company & Recruitment Details
  companyReputationRating: string;
  companyWorkCultureRating: string;
  recruitmentProcessTransparency: string;
  communicationQuality: string;
  
  // Interview Experience
  technicalInterviewDifficulty: string;
  technicalInterviewQuality: string;
  hrInterviewExperience: string;
  interviewerBehavior: string;
  
  // Preparation & Support
  collegePreparationSupport: string;
  placementCellSupport: string;
  feedbackReceivedFromCompany: string;
  
  // Offer & Compensation
  offerStatus: string; // Selected/Rejected/Pending
  packageOffered: string;
  joiningDate: string;
  
  // Additional Details
  strengths: string;
  improvements: string;
  adviceForJuniors: string;
  wouldRecommend: string;
  additionalComments: string;
  
  // Contact Preferences
  canBeContacted: string;
  alternatePhone: string;
  linkedinProfile: string;
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
  const initialFormState: FormData = {
    studentEmail: '',
    studentName: '',
    enrollmentNumber: '',
    branch: '',
    semester: '',
    academicYear: '',
    companyName: '',
    positionApplied: '',
    overallExperience: '',
    recruitmentProcess: '',
    
    companyReputationRating: '',
    companyWorkCultureRating: '',
    recruitmentProcessTransparency: '',
    communicationQuality: '',
    
    technicalInterviewDifficulty: '',
    technicalInterviewQuality: '',
    hrInterviewExperience: '',
    interviewerBehavior: '',
    
    collegePreparationSupport: '',
    placementCellSupport: '',
    feedbackReceivedFromCompany: '',
    
    offerStatus: '',
    packageOffered: '',
    joiningDate: '',
    
    strengths: '',
    improvements: '',
    adviceForJuniors: '',
    wouldRecommend: '',
    additionalComments: '',
    
    canBeContacted: '',
    alternatePhone: '',
    linkedinProfile: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  // ==================== VALIDATION ====================
  const validateFormFrontend = (): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};

    // Student Information
    if (!formData.studentEmail?.trim()) {
      errors.studentEmail = '✗ Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      errors.studentEmail = '✗ Invalid email format';
    }

    if (!formData.studentName?.trim()) {
      errors.studentName = '✗ Name is required';
    } else if (formData.studentName.length < 3) {
      errors.studentName = '✗ Name must be at least 3 characters';
    }

    if (!formData.enrollmentNumber?.trim()) {
      errors.enrollmentNumber = '✗ Enrollment number is required';
    }

    if (!formData.branch) {
      errors.branch = '✗ Branch/Department is required';
    }

    if (!formData.semester) {
      errors.semester = '✗ Semester is required';
    }

    if (!formData.academicYear) {
      errors.academicYear = '✗ Academic year is required';
    }

    // Recruitment Experience
    if (!formData.companyName?.trim()) {
      errors.companyName = '✗ Company name is required';
    }

    if (!formData.positionApplied?.trim()) {
      errors.positionApplied = '✗ Position applied is required';
    }

    if (!formData.overallExperience) {
      errors.overallExperience = '✗ Overall experience rating is required';
    }

    if (!formData.recruitmentProcess) {
      errors.recruitmentProcess = '✗ Recruitment process feedback is required';
    }

    // Ratings
    if (!formData.companyReputationRating) {
      errors.companyReputationRating = '✗ Company reputation rating is required';
    }

    if (!formData.companyWorkCultureRating) {
      errors.companyWorkCultureRating = '✗ Work culture rating is required';
    }

    if (!formData.recruitmentProcessTransparency) {
      errors.recruitmentProcessTransparency = '✗ Transparency rating is required';
    }

    if (!formData.communicationQuality) {
      errors.communicationQuality = '✗ Communication quality rating is required';
    }

    // Interview Details
    if (!formData.technicalInterviewDifficulty) {
      errors.technicalInterviewDifficulty = '✗ Technical interview difficulty is required';
    }

    if (!formData.technicalInterviewQuality) {
      errors.technicalInterviewQuality = '✗ Technical interview quality is required';
    }

    if (!formData.hrInterviewExperience) {
      errors.hrInterviewExperience = '✗ HR interview experience is required';
    }

    if (!formData.interviewerBehavior) {
      errors.interviewerBehavior = '✗ Interviewer behavior rating is required';
    }

    // Support & Feedback
    if (!formData.collegePreparationSupport) {
      errors.collegePreparationSupport = '✗ College support rating is required';
    }

    if (!formData.placementCellSupport) {
      errors.placementCellSupport = '✗ Placement cell support rating is required';
    }

    if (!formData.feedbackReceivedFromCompany) {
      errors.feedbackReceivedFromCompany = '✗ Please specify feedback received';
    }

    // Offer Details
    if (!formData.offerStatus) {
      errors.offerStatus = '✗ Offer status is required';
    }

    if (formData.offerStatus === 'Selected' && !formData.packageOffered?.trim()) {
      errors.packageOffered = '✗ Package offered is required';
    }

    if (formData.offerStatus === 'Selected' && !formData.joiningDate?.trim()) {
      errors.joiningDate = '✗ Joining date is required';
    }

    // Textual Feedback
    if (!formData.strengths?.trim()) {
      errors.strengths = '✗ Strengths section is required';
    } else if (formData.strengths.length < 20) {
      errors.strengths = '✗ Strengths must be at least 20 characters';
    }

    if (!formData.improvements?.trim()) {
      errors.improvements = '✗ Improvements section is required';
    } else if (formData.improvements.length < 20) {
      errors.improvements = '✗ Improvements must be at least 20 characters';
    }

    if (!formData.adviceForJuniors?.trim()) {
      errors.adviceForJuniors = '✗ Advice for juniors is required';
    } else if (formData.adviceForJuniors.length < 30) {
      errors.adviceForJuniors = '✗ Advice must be at least 30 characters';
    }

    if (!formData.wouldRecommend) {
      errors.wouldRecommend = '✗ Recommendation status is required';
    }

    // Contact Details
    if (!formData.canBeContacted) {
      errors.canBeContacted = '✗ Please specify contact preference';
    }

    if (formData.canBeContacted === 'Yes' && !formData.alternatePhone?.trim()) {
      errors.alternatePhone = '✗ Phone number is required';
    } else if (
      formData.alternatePhone?.trim() &&
      !/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(formData.alternatePhone)
    ) {
      errors.alternatePhone = '✗ Invalid phone format';
    }

    if (formData.linkedinProfile?.trim() && !/^https?:\/\/.+/.test(formData.linkedinProfile)) {
      errors.linkedinProfile = '✗ Invalid LinkedIn URL';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateFormFrontend();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setSubmitError('❌ Please fix the highlighted errors above');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await axios.post('/api/students/feedback', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        setShowSuccessMessage(true);
        setFormData(initialFormState);
        setValidationErrors({});

        setTimeout(() => setShowSuccessMessage(false), 5000);
        console.log('✅ Feedback submitted successfully');
      }
    } catch (error) {
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
          'Failed to submit form. Please try again.';
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
      <p className="text-red-600 text-xs font-semibold mt-2 bg-red-50 p-2 rounded border-l-2 border-red-500">
        {validationErrors[fieldName]}
      </p>
    );
  };

  // Options
  const branches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biomedical & Robotic Engineering',
    'Fire Technology & Safety',
    'Computer Science & Engineering (AI)',
    'Computer Science & Engineering (Cyber Security)',
    'Computer Science & Engineering (Data Science)',
    'Computer Science & Engineering (IoT)',
    'Electronics Engineering (VLSI Design & Technology)',
    'Mechatronics Engineering',
    'Robotics and Automation',
    'Other'
  ];

  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  const years = ['2023-24', '2024-25', '2025-26'];
  
  const ratingScale = [
    { value: '5', label: '5 - Excellent' },
    { value: '4', label: '4 - Very Good' },
    { value: '3', label: '3 - Good' },
    { value: '2', label: '2 - Average' },
    { value: '1', label: '1 - Poor' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-blue-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Bihar Engineering University
              </h1>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">Student Feedback Form</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Student Feedback Form
              </h1>
              <div className="w-20 h-1 bg-white/50 mx-auto mb-4"></div>
              <p className="text-blue-100 text-lg mb-2">
                Bihar Engineering University, Patna
              </p>
              <div className="mt-4 text-sm text-blue-100/90 max-w-2xl mx-auto">
                <p>📝 Your feedback is valuable and helps us improve our placement process.</p>
                <p className="mt-1">🎯 Please share your honest experience and suggestions.</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 mx-6 mt-6 rounded-r-lg shadow-md animate-in fade-in">
              <div className="flex items-start gap-4">
                <div className="text-green-500 mt-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 font-bold text-lg">✅ Success!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Thank you for your feedback! Your response helps us enhance the placement experience.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mx-6 mt-6 rounded-r-lg shadow-md animate-in fade-in">
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

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* ==================== STUDENT INFORMATION SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                👤 Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.studentEmail ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="your.email@student.beu.edu.in"
                  />
                  {renderFieldError('studentEmail')}
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
                    maxLength={150}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="John Doe"
                  />
                  {renderFieldError('studentName')}
                </div>

                <div className={validationErrors.enrollmentNumber ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Enrollment Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="enrollmentNumber"
                    value={formData.enrollmentNumber}
                    onChange={handleChange}
                    maxLength={50}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="BEU/CSE/2021/001"
                  />
                  {renderFieldError('enrollmentNumber')}
                </div>

                <div className={validationErrors.branch ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Branch/Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Branch --</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  {renderFieldError('branch')}
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
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {renderFieldError('academicYear')}
                </div>
              </div>
            </section>

            {/* ==================== RECRUITMENT EXPERIENCE SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                🏢 Recruitment Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.companyName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    maxLength={200}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., TechCorp India Pvt. Ltd."
                  />
                  {renderFieldError('companyName')}
                </div>

                <div className={validationErrors.positionApplied ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Position Applied For <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="positionApplied"
                    value={formData.positionApplied}
                    onChange={handleChange}
                    maxLength={150}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., Software Development Engineer"
                  />
                  {renderFieldError('positionApplied')}
                </div>

                <div className={validationErrors.overallExperience ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Overall Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="overallExperience"
                    value={formData.overallExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('overallExperience')}
                </div>

                <div className={validationErrors.recruitmentProcess ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Recruitment Process Rating <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="recruitmentProcess"
                    value={formData.recruitmentProcess}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('recruitmentProcess')}
                </div>
              </div>
            </section>

            {/* ==================== COMPANY & RECRUITMENT DETAILS SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                ⭐ Company & Recruitment Ratings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.companyReputationRating ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Company Reputation <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="companyReputationRating"
                    value={formData.companyReputationRating}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('companyReputationRating')}
                </div>

                <div className={validationErrors.companyWorkCultureRating ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Work Culture <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="companyWorkCultureRating"
                    value={formData.companyWorkCultureRating}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('companyWorkCultureRating')}
                </div>

                <div className={validationErrors.recruitmentProcessTransparency ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Process Transparency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="recruitmentProcessTransparency"
                    value={formData.recruitmentProcessTransparency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('recruitmentProcessTransparency')}
                </div>

                <div className={validationErrors.communicationQuality ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Communication Quality <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="communicationQuality"
                    value={formData.communicationQuality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('communicationQuality')}
                </div>
              </div>
            </section>

            {/* ==================== INTERVIEW EXPERIENCE SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                💬 Interview Experience
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.technicalInterviewDifficulty ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Technical Interview Difficulty <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="technicalInterviewDifficulty"
                    value={formData.technicalInterviewDifficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Difficulty --</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Difficult">Difficult</option>
                    <option value="Very Difficult">Very Difficult</option>
                  </select>
                  {renderFieldError('technicalInterviewDifficulty')}
                </div>

                <div className={validationErrors.technicalInterviewQuality ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Technical Interview Quality <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="technicalInterviewQuality"
                    value={formData.technicalInterviewQuality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('technicalInterviewQuality')}
                </div>

                <div className={validationErrors.hrInterviewExperience ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    HR Interview Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hrInterviewExperience"
                    value={formData.hrInterviewExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('hrInterviewExperience')}
                </div>

                <div className={validationErrors.interviewerBehavior ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Interviewer Behavior <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="interviewerBehavior"
                    value={formData.interviewerBehavior}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('interviewerBehavior')}
                </div>
              </div>
            </section>

            {/* ==================== SUPPORT & FEEDBACK SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                🤝 Support & Feedback
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.collegePreparationSupport ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    College Preparation Support <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="collegePreparationSupport"
                    value={formData.collegePreparationSupport}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('collegePreparationSupport')}
                </div>

                <div className={validationErrors.placementCellSupport ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Placement Cell Support <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="placementCellSupport"
                    value={formData.placementCellSupport}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Rating --</option>
                    {ratingScale.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {renderFieldError('placementCellSupport')}
                </div>

                <div className={`md:col-span-2 ${validationErrors.feedbackReceivedFromCompany ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Feedback Received from Company <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="feedbackReceivedFromCompany"
                    value={formData.feedbackReceivedFromCompany}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Option --</option>
                    <option value="Yes - Positive">Yes - Positive Feedback</option>
                    <option value="Yes - Constructive">Yes - Constructive Feedback</option>
                    <option value="No">No Feedback Provided</option>
                    <option value="Minimal">Minimal Feedback</option>
                  </select>
                  {renderFieldError('feedbackReceivedFromCompany')}
                </div>
              </div>
            </section>

            {/* ==================== OFFER DETAILS SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                💼 Offer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.offerStatus ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Offer Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="offerStatus"
                    value={formData.offerStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Status --</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                  {renderFieldError('offerStatus')}
                </div>

                {formData.offerStatus === 'Selected' && (
                  <>
                    <div className={validationErrors.packageOffered ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Package Offered (LPA) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="packageOffered"
                        value={formData.packageOffered}
                        onChange={handleChange}
                        maxLength={50}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="e.g., 8.5 LPA or 12 LPA"
                      />
                      {renderFieldError('packageOffered')}
                    </div>

                    <div className={validationErrors.joiningDate ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Expected Joining Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                      />
                      {renderFieldError('joiningDate')}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ==================== TEXTUAL FEEDBACK SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                💭 Your Feedback & Suggestions
              </h2>
              <div className="space-y-6">
                <div className={validationErrors.strengths ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Company Strengths <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="strengths"
                    value={formData.strengths}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="What did you like about the company and recruitment process?"
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
                    placeholder="What could be improved in their recruitment process and communication?"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    {formData.improvements.length}/1000 characters
                  </p>
                  {renderFieldError('improvements')}
                </div>

                <div className={validationErrors.adviceForJuniors ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Advice for Junior Batches <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="adviceForJuniors"
                    value={formData.adviceForJuniors}
                    onChange={handleChange}
                    maxLength={1500}
                    rows={4}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Share your experience and tips that would help juniors prepare better for this company's recruitment..."
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    {formData.adviceForJuniors.length}/1500 characters
                  </p>
                  {renderFieldError('adviceForJuniors')}
                </div>

                <div className={validationErrors.wouldRecommend ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Would You Recommend This Company? <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="wouldRecommend"
                    value={formData.wouldRecommend}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Option --</option>
                    <option value="Highly Recommend">Highly Recommend</option>
                    <option value="Recommend">Recommend</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Would Not Recommend">Would Not Recommend</option>
                  </select>
                  {renderFieldError('wouldRecommend')}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    name="additionalComments"
                    value={formData.additionalComments}
                    onChange={handleChange}
                    maxLength={1500}
                    rows={3}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Any other feedback or comments..."
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    {formData.additionalComments.length}/1500 characters
                  </p>
                </div>
              </div>
            </section>

            {/* ==================== CONTACT PREFERENCES SECTION ==================== */}
            <section className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 rounded-xl border border-blue-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-3 border-b border-blue-300">
                📞 Contact Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.canBeContacted ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    Can We Contact You For Follow-up? <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="canBeContacted"
                    value={formData.canBeContacted}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Option --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {renderFieldError('canBeContacted')}
                </div>

                {formData.canBeContacted === 'Yes' && (
                  <div className={validationErrors.alternatePhone ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Alternate Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="+91 98765 43210"
                    />
                    {renderFieldError('alternatePhone')}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  {renderFieldError('linkedinProfile')}
                </div>
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
                    <span>Submitting...</span>
                  </div>
                ) : (
                  '📤 Submit Feedback'
                )}
              </button>
              <p className="mt-4 text-xs text-blue-600 text-center">
                🔒 Your feedback is confidential and will help us improve placements
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-8 border-t border-blue-200">
            <div className="text-center space-y-4">
              <p className="font-bold text-blue-900 text-lg">📞 Training & Placement Cell</p>
              <p className="font-semibold text-blue-800">Bihar Engineering University, Patna</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href="mailto:tpo.beu@bihar.gov.in" className="text-blue-700 hover:underline">
                  📧 tpo.beu@bihar.gov.in
                </a>
                <a href="tel:7903289860" className="text-blue-700 hover:underline">
                  📱 +91 7903289860
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedbackForm;