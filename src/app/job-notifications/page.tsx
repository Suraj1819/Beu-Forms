"use client";

import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface FormData {
  email: string;
  companyName: string;
  aboutCompany: string;
  correspondenceAddress: string;
  dateOfEstablishment: string;
  numberOfEmployees: string;
  socialMediaLink: string;
  website: string;
  typeOfOrganization: string;
  mncHeadOffice: string;
  natureOfBusiness: string[];
  headHRName: string;
  headHRContact: string;
  headHREmail: string;
  firstContactName: string;
  firstContactEmail: string;
  firstContactPhone: string;
  secondContactName: string;
  secondContactEmail: string;
  secondContactPhone: string;
  jobProfile: string;
  jobTitle: string;
  jobDescription: string;
  minHires: string;
  expectedHires: string;
  jobLocation: string;
  requiredSkills: string;
  eligibleDegrees: string[];
  eligibleBTechDepartments: string[];
  eligibleMTechDepartments: string[];
  eligiblePhDDepartments: string[];
  jobDesignationBTech: string;
  jobDescBTech: string;
  jobDesignationMTech: string;
  jobDescMTech: string;
  jobDesignationPhD: string;
  jobDescPhD: string;
  cgpaCutoff: string;
  backlogEligibility: string;
  modeOfSelection: string;
  selectionRounds: string[];
  totalRounds: string;
  syllabus: string;
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

const JobNotificationForm: React.FC = () => {
  const initialFormState: FormData = {
    email: '',
    companyName: '',
    aboutCompany: '',
    correspondenceAddress: '',
    dateOfEstablishment: '',
    numberOfEmployees: '',
    socialMediaLink: '',
    website: '',
    typeOfOrganization: '',
    mncHeadOffice: '',
    natureOfBusiness: [],
    headHRName: '',
    headHRContact: '',
    headHREmail: '',
    firstContactName: '',
    firstContactEmail: '',
    firstContactPhone: '',
    secondContactName: '',
    secondContactEmail: '',
    secondContactPhone: '',
    jobProfile: '',
    jobTitle: '',
    jobDescription: '',
    minHires: '',
    expectedHires: '',
    jobLocation: '',
    requiredSkills: '',
    eligibleDegrees: [],
    eligibleBTechDepartments: [],
    eligibleMTechDepartments: [],
    eligiblePhDDepartments: [],
    jobDesignationBTech: '',
    jobDescBTech: '',
    jobDesignationMTech: '',
    jobDescMTech: '',
    jobDesignationPhD: '',
    jobDescPhD: '',
    cgpaCutoff: '',
    backlogEligibility: '',
    modeOfSelection: '',
    selectionRounds: [],
    totalRounds: '',
    syllabus: ''
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

    // Email Validation
    if (!formData.email?.trim()) {
      errors.email = '✗ Company email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '✗ Invalid email format';
    }

    // Company Info Validation
    if (!formData.companyName?.trim()) {
      errors.companyName = '✗ Company name is required';
    } else if (formData.companyName.length < 3) {
      errors.companyName = '✗ Company name must be at least 3 characters';
    }

    if (!formData.website?.trim()) {
      errors.website = '✗ Website URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.website)) {
      errors.website = '✗ Website must start with http:// or https://';
    }

    if (!formData.aboutCompany?.trim()) {
      errors.aboutCompany = '✗ About company is required';
    } else if (formData.aboutCompany.length < 20) {
      errors.aboutCompany = '✗ About company must be at least 20 characters';
    }

    if (!formData.correspondenceAddress?.trim()) {
      errors.correspondenceAddress = '✗ Correspondence address is required';
    } else if (formData.correspondenceAddress.length < 10) {
      errors.correspondenceAddress = '✗ Address must be at least 10 characters';
    }

    if (!formData.typeOfOrganization) {
      errors.typeOfOrganization = '✗ Type of organization is required';
    }

    if ((formData.typeOfOrganization === 'MNC(Indian Origin)' || 
         formData.typeOfOrganization === 'MNC(Foreign Origin)') &&
        !formData.mncHeadOffice?.trim()) {
      errors.mncHeadOffice = '✗ MNC head office location is required';
    }

    if (formData.natureOfBusiness.length === 0) {
      errors.natureOfBusiness = '✗ Select at least one nature of business';
    }

    // HR Validation
    if (!formData.headHRName?.trim()) {
      errors.headHRName = '✗ Head HR name is required';
    }

    if (!formData.headHRContact?.trim()) {
      errors.headHRContact = '✗ Head HR contact is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(formData.headHRContact)) {
      errors.headHRContact = '✗ Contact must be 10-15 digits';
    }

    if (!formData.headHREmail?.trim()) {
      errors.headHREmail = '✗ Head HR email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.headHREmail)) {
      errors.headHREmail = '✗ Invalid email format';
    }

    // First Contact Validation
    if (!formData.firstContactName?.trim()) {
      errors.firstContactName = '✗ First contact name is required';
    }

    if (!formData.firstContactEmail?.trim()) {
      errors.firstContactEmail = '✗ First contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.firstContactEmail)) {
      errors.firstContactEmail = '✗ Invalid email format';
    }

    if (!formData.firstContactPhone?.trim()) {
      errors.firstContactPhone = '✗ First contact phone is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(formData.firstContactPhone)) {
      errors.firstContactPhone = '✗ Phone must be 10-15 digits';
    }

    // Second Contact Validation
    if (!formData.secondContactName?.trim()) {
      errors.secondContactName = '✗ Second contact name is required';
    }

    if (!formData.secondContactEmail?.trim()) {
      errors.secondContactEmail = '✗ Second contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.secondContactEmail)) {
      errors.secondContactEmail = '✗ Invalid email format';
    }

    if (!formData.secondContactPhone?.trim()) {
      errors.secondContactPhone = '✗ Second contact phone is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(formData.secondContactPhone)) {
      errors.secondContactPhone = '✗ Phone must be 10-15 digits';
    }

    // Job Details Validation
    if (!formData.jobProfile?.trim()) {
      errors.jobProfile = '✗ Job profile is required';
    }

    if (!formData.jobTitle?.trim()) {
      errors.jobTitle = '✗ Job title is required';
    }

    if (!formData.jobDescription?.trim()) {
      errors.jobDescription = '✗ Job description is required';
    } else if (formData.jobDescription.length < 30) {
      errors.jobDescription = '✗ Job description must be at least 30 characters';
    }

    const minHiresNum = parseInt(formData.minHires) || 0;
    if (!formData.minHires || isNaN(minHiresNum) || minHiresNum < 0) {
      errors.minHires = '✗ Valid minimum hires required (non-negative number)';
    }

    const expectedHiresNum = parseInt(formData.expectedHires) || 0;
    if (!formData.expectedHires || isNaN(expectedHiresNum) || expectedHiresNum < minHiresNum) {
      errors.expectedHires = '✗ Expected hires must be >= minimum hires';
    }

    if (!formData.jobLocation?.trim()) {
      errors.jobLocation = '✗ Job location is required';
    }

    if (!formData.requiredSkills?.trim()) {
      errors.requiredSkills = '✗ Required skills are required';
    }

    // Eligibility Validation
    if (formData.eligibleDegrees.length === 0) {
      errors.eligibleDegrees = '✗ Select at least one eligible degree';
    }

    if (formData.eligibleBTechDepartments.length === 0) {
      errors.eligibleBTechDepartments = '✗ Select at least one B.Tech department';
    }

    if (formData.eligibleMTechDepartments.length === 0) {
      errors.eligibleMTechDepartments = '✗ Select at least one M.Tech department';
    }

    if (formData.eligiblePhDDepartments.length === 0) {
      errors.eligiblePhDDepartments = '✗ Select at least one PhD department';
    }

    // Role-Specific Validation
    if (!formData.jobDesignationBTech?.trim()) {
      errors.jobDesignationBTech = '✗ B.Tech job designation is required';
    }

    if (!formData.jobDescBTech?.trim()) {
      errors.jobDescBTech = '✗ B.Tech job description is required';
    }

    if (!formData.jobDesignationMTech?.trim()) {
      errors.jobDesignationMTech = '✗ M.Tech job designation is required';
    }

    if (!formData.jobDescMTech?.trim()) {
      errors.jobDescMTech = '✗ M.Tech job description is required';
    }

    if (!formData.jobDesignationPhD?.trim()) {
      errors.jobDesignationPhD = '✗ PhD job designation is required';
    }

    if (!formData.jobDescPhD?.trim()) {
      errors.jobDescPhD = '✗ PhD job description is required';
    }

    // Selection Process Validation
    if (!formData.cgpaCutoff?.trim()) {
      errors.cgpaCutoff = '✗ CGPA cutoff is required';
    }

    if (!formData.backlogEligibility) {
      errors.backlogEligibility = '✗ Backlog eligibility is required';
    }

    if (!formData.modeOfSelection) {
      errors.modeOfSelection = '✗ Mode of selection is required';
    }

    if (!formData.totalRounds) {
      errors.totalRounds = '✗ Total rounds is required';
    }

    if (formData.selectionRounds.length === 0) {
      errors.selectionRounds = '✗ Select at least one selection round';
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
    
    if (type === 'checkbox') {
      const arrayFields = [
        'natureOfBusiness',
        'eligibleDegrees',
        'eligibleBTechDepartments',
        'eligibleMTechDepartments',
        'eligiblePhDDepartments',
        'selectionRounds'
      ];
      
      const fieldName = name.split('[')[0];

      if (arrayFields.includes(fieldName)) {
        setFormData(prev => {
          const currentArray = [...(prev[fieldName as keyof FormData] as string[])];
          if (checked) {
            return { ...prev, [fieldName]: [...currentArray, value] };
          } else {
            return {
              ...prev,
              [fieldName]: currentArray.filter(item => item !== value)
            };
          }
        });
      }
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

  // Handle form submission
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

    setValidationErrors({});
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    setShowSuccessMessage(false);

    try {
      const response = await axios.post('/api/users/job-notifications', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

      if (response.status === 200 || response.status === 201) {
        // Log success to console
        console.log('✅ Job Notification Form Submitted Successfully!', {
          status: response.status,
          message: response.data?.message || 'Form submitted successfully',
          timestamp: new Date().toISOString(),
          companyName: formData.companyName,
          email: formData.email,
          data: response.data
        });

        // Set success states
        setSubmitSuccess(true);
        setShowSuccessMessage(true);
        
        // Reset form
        setFormData(initialFormState);
        setValidationErrors({});
        
        // Scroll to top smoothly
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });

        // Hide success message after 8 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 8000);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      
      console.error('❌ Job Notification Form Submission Error:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        message: axiosError.message,
        data: axiosError.response?.data,
        timestamp: new Date().toISOString()
      });

      // Scroll to top to show error
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });

      // Handle backend validation errors
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
  const organizationTypes = [
    'Private', 'MNC(Indian Origin)', 'MNC(Foreign Origin)',
    'Government', 'PSUs', 'NGO', 'STARTUP', 'Other'
  ];

  const natureOfBusinessOptions = [
    'Core Engineering & technology', 'Analytics', 'IT/Software', 'Oil & Gas',
    'Data Science', 'Cyber Security', 'Finance & Consulting', 'Management',
    'Teaching/Research', 'Media', 'E-Commerce', 'Construction',
    'Design', 'Manufacturing', 'Infrastructure', 'Other'
  ];

  const degreeOptions = [
    'B. Tech(4 years)', 'B.Arch(5 years)', 'M.Tech (2 years)', 'MBA', 'PhD'
  ];

  const btechDepartments = [
    'All', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
    'Electronics & Communication Engineering', 'Computer Science & Engineering',
    'Information Technology', 'Chemical Technology (Leather Technology)',
    'Biomedical & Robotic Engineering', 'Electrical & Electronics Engineering',
    'Civil Engineering with Computer Application', 'Computer Science & Engineering (AI)',
    'Fire Technology & Safety', 'Computer Science & Engineering (Cyber Security)',
    'Aeronautical Engineering', 'Food Processing & Preservation',
    'Computer Science & Engineering (IoT)',
    'Electronics & Communication Engineering (Advance Communication Technology)',
    'Computer Science & Engineering(AI & ML)', 'Chemical Engineering',
    'Computer Science & Engineering(Data Science)',
    'Electronics Engineering (VLSI Design & Technology)',
    'Mining Engineering', '3-D Animation & Graphics', 'Mechanical & Smart Manufacturing',
    'Mechatronics Engineering', 'Computer Science & Engineering (Networks)',
    'Computer Science & Engg (IOT & Cyber Security including Block Chain Technology)',
    'Robotics and Automation', 'Instrumentation Engineering', 'Agricultural Engineering',
    'Waste Management', 'Petrochemical Engineering',
    'Chemical Engineering (Plastic & Polymer)',
    'Marine Engineering', 'B.Arch', 'Not Applicable'
  ];

  const mtechDepartments = [
    'All', 'Machine Design', 'Thermal Engineering', 'Manufacturing Technology',
    'Energy System and Management', 'Manufacturing Engineering',
    'Advanced Electronics and Communication Engineering', 'VLSI Design',
    'Signal Processing and VLSI Technology', 'Micro Electronics & VLSI Technology',
    'Advance Communication Technology', 'Electronics and Communication Engineering',
    'Geotechnical Engineering', 'Transportation Engineering', 'Structural Engineering',
    'Computer Science & Engineering', 'Cyber Security', 'Electrical Energy Systems',
    'Power System', 'Electrical Power System', 'Geoinformatics', 'MBA', 'Not Applicable'
  ];

  const phdDepartments = [
    'All', 'Civil Engineering', 'Computer Science and Engineering',
    'Electrical Engineering', 'Electronics and Communication Engineering',
    'Mechanical Engineering', 'Not Applicable'
  ];

  const selectionRoundsOptions = [
    'Pre-Placement Talk', 'Aptitude Test', 'Technical Test(Online Assessment)',
    'Personal Interview', 'HR Round', 'Group Discussion', 'Psychometric Test',
    'Medical Test', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
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
      <nav className="bg-white/90 backdrop-blur-lg border-b border-amber-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Bihar Engineering University
              </h1>
              <p className="text-xs sm:text-sm text-amber-700 mt-1">Training & Placement Cell</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-amber-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Job Notification Form (JNF)
              </h1>
              <div className="w-20 h-1 bg-white/50 mx-auto mb-4"></div>
              <p className="text-amber-100 text-lg mb-2">
                Bihar Engineering University, Patna
              </p>
              <div className="mt-4 text-sm text-amber-100/90 max-w-2xl mx-auto">
                <p>📋 This form is for companies to provide placement opportunities for BEU students.</p>
                <p className="mt-1">🎯 Please fill all required fields marked with (*) to complete your submission.</p>
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
                    ✅ Form Submitted Successfully!
                  </p>
                  <p className="text-green-700 text-base leading-relaxed">
                    Thank you for your interest in recruiting from Bihar Engineering University! 
                    Your Job Notification Form has been successfully submitted to our Training & Placement Cell. 
                    Our team will review your submission and contact you shortly for further coordination.
                  </p>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      🔔 A confirmation email has been sent to your registered email address.
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

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* ==================== COMPANY INFORMATION SECTION ==================== */}
            <section className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 rounded-xl border border-amber-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 pb-3 border-b border-amber-300">
                🏢 Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Field */}
                <div className={`md:col-span-2 ${validationErrors.email ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Company Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="company@email.com"
                  />
                  {renderFieldError('email')}
                </div>

                {/* Company Name */}
                <div className={`${validationErrors.companyName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Name of the Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    maxLength={200}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., Tech Solutions Pvt. Ltd."
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    {formData.companyName.length}/200 characters
                  </p>
                  {renderFieldError('companyName')}
                </div>

                {/* Website */}
                <div className={`${validationErrors.website ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="https://www.yourcompany.com"
                  />
                  {renderFieldError('website')}
                </div>

                {/* About Company */}
                <div className={`md:col-span-2 ${validationErrors.aboutCompany ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    About Company <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="aboutCompany"
                    value={formData.aboutCompany}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={4}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Describe your company's mission, vision, core business activities, company culture, and what makes it unique as an employer."
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    {formData.aboutCompany.length}/1000 characters
                  </p>
                  {renderFieldError('aboutCompany')}
                </div>

                {/* Correspondence Address */}
                <div className={`md:col-span-2 ${validationErrors.correspondenceAddress ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Correspondence Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="correspondenceAddress"
                    value={formData.correspondenceAddress}
                    onChange={handleChange}
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Complete registered office address including building name/number, street, area, city, state, and PIN code"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    {formData.correspondenceAddress.length}/500 characters
                  </p>
                  {renderFieldError('correspondenceAddress')}
                </div>

                {/* Date of Establishment */}
                <div>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Date of Establishment
                  </label>
                  <input
                    type="date"
                    name="dateOfEstablishment"
                    value={formData.dateOfEstablishment}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 transition-all"
                  />
                </div>

                {/* Number of Employees */}
                <div>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    name="numberOfEmployees"
                    value={formData.numberOfEmployees}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Total workforce size"
                  />
                </div>

                {/* Social Media Link */}
                <div>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Social Media Page Link
                  </label>
                  <input
                    type="url"
                    name="socialMediaLink"
                    value={formData.socialMediaLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="LinkedIn company page URL"
                  />
                </div>

                {/* Type of Organization */}
                <div className={validationErrors.typeOfOrganization ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Type of Organization <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="typeOfOrganization"
                    value={formData.typeOfOrganization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select Organization Type --</option>
                    {organizationTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {renderFieldError('typeOfOrganization')}
                </div>

                {/* MNC Head Office */}
                {(formData.typeOfOrganization === 'MNC(Indian Origin)' ||
                  formData.typeOfOrganization === 'MNC(Foreign Origin)') && (
                  <div className={`md:col-span-2 ${validationErrors.mncHeadOffice ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                      Location and Head office of the parent company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mncHeadOffice"
                      value={formData.mncHeadOffice}
                      onChange={handleChange}
                      maxLength={300}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="Parent company headquarters with complete address and country"
                    />
                    {renderFieldError('mncHeadOffice')}
                  </div>
                )}
              </div>
            </section>

            {/* ==================== NATURE OF BUSINESS SECTION ==================== */}
            <section className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 rounded-xl border border-amber-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 pb-3 border-b border-amber-300">
                🏭 Nature of Business / Industry Sector
              </h2>
              <p className="text-sm text-amber-700 mb-4">
                Select all business sectors: <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {natureOfBusinessOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-amber-100/50 transition-colors cursor-pointer border border-amber-200/50 bg-white/50">
                    <input
                      type="checkbox"
                      name="natureOfBusiness"
                      value={option}
                      checked={formData.natureOfBusiness.includes(option)}
                      onChange={handleChange}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-amber-800">{option}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-amber-600 mt-3">
                Selected: {formData.natureOfBusiness.length} option(s)
              </p>
              {renderFieldError('natureOfBusiness')}
            </section>

            {/* ==================== HR & CONTACT SECTION ==================== */}
            <section className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 rounded-xl border border-amber-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 pb-3 border-b border-amber-300">
                👥 HR & Contact Information
              </h2>

              {/* Head HR */}
              <div className="space-y-8">
                <div className="bg-white/60 p-5 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-amber-800 mb-4 text-lg">📋 Head HR Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={validationErrors.headHRName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="headHRName"
                        value={formData.headHRName}
                        onChange={handleChange}
                        maxLength={150}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="Full name of HR Head"
                      />
                      {renderFieldError('headHRName')}
                    </div>

                    <div className={validationErrors.headHRContact ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Contact No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="headHRContact"
                        value={formData.headHRContact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="+91 98765 43210"
                      />
                      {renderFieldError('headHRContact')}
                    </div>

                    <div className={validationErrors.headHREmail ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="headHREmail"
                        value={formData.headHREmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="hr.head@company.com"
                      />
                      {renderFieldError('headHREmail')}
                    </div>
                  </div>
                </div>

                {/* First Contact */}
                <div className="bg-white/60 p-5 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-amber-800 mb-4 text-lg">👤 First Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={validationErrors.firstContactName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstContactName"
                        value={formData.firstContactName}
                        onChange={handleChange}
                        maxLength={150}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="Primary contact person name"
                      />
                      {renderFieldError('firstContactName')}
                    </div>

                    <div className={validationErrors.firstContactEmail ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="firstContactEmail"
                        value={formData.firstContactEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="recruitment@company.com"
                      />
                      {renderFieldError('firstContactEmail')}
                    </div>

                    <div className={validationErrors.firstContactPhone ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="firstContactPhone"
                        value={formData.firstContactPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="10-digit phone number"
                      />
                      {renderFieldError('firstContactPhone')}
                    </div>
                  </div>
                </div>

                {/* Second Contact */}
                <div className="bg-white/60 p-5 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-amber-800 mb-4 text-lg">👤 Second Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={validationErrors.secondContactName ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="secondContactName"
                        value={formData.secondContactName}
                        onChange={handleChange}
                        maxLength={150}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="Alternate contact person name"
                      />
                      {renderFieldError('secondContactName')}
                    </div>

                    <div className={validationErrors.secondContactEmail ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="secondContactEmail"
                        value={formData.secondContactEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="hr2@company.com"
                      />
                      {renderFieldError('secondContactEmail')}
                    </div>

                    <div className={validationErrors.secondContactPhone ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="secondContactPhone"
                        value={formData.secondContactPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="10-digit phone number"
                      />
                      {renderFieldError('secondContactPhone')}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================== JOB DETAILS SECTION ==================== */}
            <section className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 rounded-xl border border-amber-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 pb-3 border-b border-amber-300">
                💼 Job Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.jobProfile ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Job Profile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobProfile"
                    value={formData.jobProfile}
                    onChange={handleChange}
                    maxLength={200}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., Software Development"
                  />
                  {renderFieldError('jobProfile')}
                </div>

                <div className={validationErrors.jobTitle ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    maxLength={200}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {renderFieldError('jobTitle')}
                </div>

                <div className={`md:col-span-2 ${validationErrors.jobDescription ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    maxLength={2000}
                    rows={4}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Detailed job responsibilities, key duties, day-to-day tasks..."
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    {formData.jobDescription.length}/2000 characters
                  </p>
                  {renderFieldError('jobDescription')}
                </div>

                <div className={validationErrors.minHires ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Minimum Hires <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="minHires"
                    value={formData.minHires}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., 5"
                  />
                  {renderFieldError('minHires')}
                </div>

                <div className={validationErrors.expectedHires ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Expected Hires <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="expectedHires"
                    value={formData.expectedHires}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., 15"
                  />
                  {renderFieldError('expectedHires')}
                </div>

                <div className={`md:col-span-2 ${validationErrors.jobLocation ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Location(s) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobLocation"
                    value={formData.jobLocation}
                    onChange={handleChange}
                    maxLength={300}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., Mumbai, Delhi, Bangalore | Remote"
                  />
                  {renderFieldError('jobLocation')}
                </div>

                <div className={`md:col-span-2 ${validationErrors.requiredSkills ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Required Skills <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    maxLength={1500}
                    rows={3}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Java, Python, React.js, SQL, Cloud platforms..."
                  />
                  {renderFieldError('requiredSkills')}
                </div>
              </div>
            </section>

            {/* ==================== ELIGIBILITY SECTION ==================== */}
            <section className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 rounded-xl border border-amber-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 pb-3 border-b border-amber-300">
                🎓 Eligibility Criteria
              </h2>

              {/* Academic Degrees */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-amber-800 mb-3">
                  Eligible Degrees <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {degreeOptions.map((degree) => (
                    <label key={degree} className="flex items-center space-x-2 p-4 bg-white/60 rounded-lg border border-amber-200/50 hover:bg-amber-100/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="eligibleDegrees"
                        value={degree}
                        checked={formData.eligibleDegrees.includes(degree)}
                        onChange={handleChange}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-amber-800">{degree}</span>
                    </label>
                  ))}
                </div>
                {renderFieldError('eligibleDegrees')}
              </div>

              {/* B.Tech Departments */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-amber-800 mb-3">
                  B.Tech Departments <span className="text-red-500">*</span>
                </label>
                <div className="max-h-64 overflow-y-auto p-4 border border-amber-200 rounded-lg bg-white/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {btechDepartments.map((dept) => (
                      <label key={dept} className="flex items-center space-x-2 p-2 rounded hover:bg-amber-100/50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          name="eligibleBTechDepartments"
                          value={dept}
                          checked={formData.eligibleBTechDepartments.includes(dept)}
                          onChange={handleChange}
                          className="rounded text-amber-600 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-amber-800">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {renderFieldError('eligibleBTechDepartments')}
              </div>

              {/* M.Tech Departments */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-amber-800 mb-3">
                  M.Tech Departments <span className="text-red-500">*</span>
                </label>
                <div className="max-h-64 overflow-y-auto p-4 border border-amber-200 rounded-lg bg-white/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mtechDepartments.map((dept) => (
                      <label key={dept} className="flex items-center space-x-2 p-2 rounded hover:bg-amber-100/50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          name="eligibleMTechDepartments"
                          value={dept}
                          checked={formData.eligibleMTechDepartments.includes(dept)}
                          onChange={handleChange}
                          className="rounded text-amber-600 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-amber-800">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {renderFieldError('eligibleMTechDepartments')}
              </div>

              {/* PhD Departments */}
              <div>
                <label className="block text-sm font-semibold text-amber-800 mb-3">
                  PhD Departments <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {phdDepartments.map((dept) => (
                                        <label key={dept} className="flex items-center space-x-2 p-4 bg-white/60 rounded-lg border border-amber-200/50 hover:bg-amber-100/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="eligiblePhDDepartments"
                        value={dept}
                        checked={formData.eligiblePhDDepartments.includes(dept)}
                        onChange={handleChange}
                        className="rounded text-amber-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-amber-800">{dept}</span>
                    </label>
                  ))}
                </div>
                {renderFieldError('eligiblePhDDepartments')}
              </div>
            </section>

            {/* ==================== ROLE-SPECIFIC SECTION ==================== */}
            <section className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 rounded-xl border border-amber-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 pb-3 border-b border-amber-300">
                🎯 Role-specific Details
              </h2>

              {/* B.Tech */}
              <div className="mb-8 bg-white/60 p-5 rounded-lg border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-4 text-lg">🎓 For B.Tech/B.Arch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={validationErrors.jobDesignationBTech ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobDesignationBTech"
                      value={formData.jobDesignationBTech}
                      onChange={handleChange}
                      maxLength={200}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="Entry-level position"
                    />
                    {renderFieldError('jobDesignationBTech')}
                  </div>

                  <div className={validationErrors.jobDescBTech ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="jobDescBTech"
                      value={formData.jobDescBTech}
                      onChange={handleChange}
                      maxLength={1000}
                      rows={2}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                      placeholder="Fresh graduate responsibilities..."
                    />
                    {renderFieldError('jobDescBTech')}
                  </div>
                </div>
              </div>

              {/* M.Tech */}
              <div className="mb-8 bg-white/60 p-5 rounded-lg border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-4 text-lg">🎓 For M.Tech/MBA</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={validationErrors.jobDesignationMTech ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobDesignationMTech"
                      value={formData.jobDesignationMTech}
                      onChange={handleChange}
                      maxLength={200}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="Mid-level position"
                    />
                    {renderFieldError('jobDesignationMTech')}
                  </div>

                  <div className={validationErrors.jobDescMTech ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="jobDescMTech"
                      value={formData.jobDescMTech}
                      onChange={handleChange}
                      maxLength={1000}
                      rows={2}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                      placeholder="Technical leadership responsibilities..."
                    />
                    {renderFieldError('jobDescMTech')}
                  </div>
                </div>
              </div>

              {/* PhD */}
              <div className="bg-white/60 p-5 rounded-lg border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-4 text-lg">🎓 For PhD</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={validationErrors.jobDesignationPhD ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobDesignationPhD"
                      value={formData.jobDesignationPhD}
                      onChange={handleChange}
                      maxLength={200}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="Senior position"
                    />
                    {renderFieldError('jobDesignationPhD')}
                  </div>

                  <div className={validationErrors.jobDescPhD ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="jobDescPhD"
                      value={formData.jobDescPhD}
                      onChange={handleChange}
                      maxLength={1000}
                      rows={2}
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                      placeholder="Research leadership responsibilities..."
                    />
                    {renderFieldError('jobDescPhD')}
                  </div>
                </div>
              </div>
            </section>

            {/* ==================== SELECTION PROCESS SECTION ==================== */}
            <section className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 p-6 rounded-xl border border-amber-300/50 shadow-sm">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 pb-3 border-b border-amber-300">
                📋 Selection Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={validationErrors.cgpaCutoff ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    CGPA Cutoff <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cgpaCutoff"
                    value={formData.cgpaCutoff}
                    onChange={handleChange}
                    maxLength={100}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="e.g., 7.0 or NA"
                  />
                  {renderFieldError('cgpaCutoff')}
                </div>

                <div className={validationErrors.backlogEligibility ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Backlog Eligibility <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="backlogEligibility"
                    value={formData.backlogEligibility}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select --</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {renderFieldError('backlogEligibility')}
                </div>

                <div className={validationErrors.modeOfSelection ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Mode of Selection <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="modeOfSelection"
                    value={formData.modeOfSelection}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="">-- Select --</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Campus Visit">Campus Visit</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  {renderFieldError('modeOfSelection')}
                </div>

                <div className={validationErrors.totalRounds ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}>
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Total Rounds <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalRounds"
                    value={formData.totalRounds}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="1-10"
                  />
                  {renderFieldError('totalRounds')}
                </div>

                <div className={`md:col-span-2 ${validationErrors.selectionRounds ? 'ring-2 ring-red-500 p-4 rounded-lg' : ''}`}>
                  <label className="block text-sm font-semibold text-amber-800 mb-3">
                    Selection Rounds <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectionRoundsOptions.map((round) => (
                      <label key={round} className="flex items-center space-x-2 p-3 bg-white/60 rounded-lg border border-amber-200/50 hover:bg-amber-100/50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          name="selectionRounds"
                          value={round}
                          checked={formData.selectionRounds.includes(round)}
                          onChange={handleChange}
                          className="rounded text-amber-600 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-amber-800">{round}</span>
                      </label>
                    ))}
                  </div>
                  {renderFieldError('selectionRounds')}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-amber-800 mb-2">
                    Syllabus (Optional)
                  </label>
                  <textarea
                    name="syllabus"
                    value={formData.syllabus}
                    onChange={handleChange}
                    maxLength={2000}
                    rows={4}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Topics, programming languages, concepts..."
                  />
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
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-[1.02] hover:shadow-xl focus:ring-4 focus:ring-amber-300'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  '🚀 Submit Form'
                )}
              </button>
              <p className="mt-4 text-xs text-amber-600 text-center">
                🔒 Secure form managed by Bihar Engineering University
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 p-8 border-t border-amber-200">
            <div className="text-center space-y-4">
              <p className="font-bold text-amber-900 text-lg">📞 Training & Placement Cell</p>
              <p className="font-semibold text-amber-800">Bihar Engineering University, Patna</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href="mailto:tpo.beu@bihar.gov.in" className="text-amber-700 hover:underline">
                  📧 tpo.beu@bihar.gov.in
                </a>
                <a href="tel:7903289860" className="text-amber-700 hover:underline">
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

export default JobNotificationForm;