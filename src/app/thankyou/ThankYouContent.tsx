// app/thankyou/ThankYouContent.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get('ref');
  const email = searchParams.get('email');
  const studentName = searchParams.get('name');
  const [countdown, setCountdown] = useState(10);

  const handleRedirect = useCallback(() => {
    window.location.href = '/';
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleRedirect]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-blue-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex-1 text-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Government Engineering College
              </h1>
              <p className="text-xs sm:text-sm text-blue-700">Vaishali</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          
          {/* Success Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 px-4 sm:px-8 py-8 sm:py-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute w-24 sm:w-40 h-24 sm:h-40 bg-white rounded-full -top-10 -right-10 animate-pulse"></div>
                <div className="absolute w-20 sm:w-32 h-20 sm:h-32 bg-white rounded-full -bottom-5 -left-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              <div className="relative z-10 flex justify-center mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                  <div className="relative bg-white rounded-full p-4 sm:p-6 shadow-lg">
                    <svg className="w-10 h-10 sm:w-16 sm:h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-1 sm:mb-2">
                Thank You!
              </h1>
              <p className="text-base sm:text-lg text-white/90 font-semibold drop-shadow">
                Your feedback has been submitted
              </p>
            </div>

            {/* Body Section */}
            <div className="px-4 sm:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
              
              <div className="text-center space-y-2 sm:space-y-3">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  {studentName ? `Dear ${studentName}` : 'Dear Student'},
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We appreciate you taking the time to share your valuable feedback with us.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a1 1 0 001 1h12a1 1 0 001-1V6a2 2 0 00-2-2H4zm12 12H4a2 2 0 01-2-2v-4a1 1 0 00-1-1H.5a1.5 1.5 0 101.5 1.5h11a1.5 1.5 0 101.5-1.5H16a1 1 0 00-1 1v4a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-blue-900 mb-1 sm:mb-2">
                      Message from Government Engineering College, Vaishali
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                      We deeply appreciate your valuable feedback. Your insights help us maintain and improve the quality of education and facilities. We are committed to continuous improvement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 sm:p-5 border border-green-200">
                  <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1 sm:mb-2">Reference ID</p>
                  <p className="text-sm sm:text-base font-mono font-bold text-green-900 break-all">{referenceId || 'N/A'}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 sm:p-5 border border-purple-200">
                  <p className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-1 sm:mb-2">Confirmation Email</p>
                  <p className="text-xs sm:text-sm text-purple-900 break-all font-medium">{email || 'your registered email'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200 text-center hover:shadow-md transition">
                  <p className="text-2xl sm:text-3xl mb-1">🔒</p>
                  <p className="text-xs font-semibold text-green-900">Confidential</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200 text-center hover:shadow-md transition">
                  <p className="text-2xl sm:text-3xl mb-1">📊</p>
                  <p className="text-xs font-semibold text-blue-900">Reviewed</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200 text-center hover:shadow-md transition">
                  <p className="text-2xl sm:text-3xl mb-1">✅</p>
                  <p className="text-xs font-semibold text-purple-900">Recorded</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200 text-center hover:shadow-md transition">
                  <p className="text-2xl sm:text-3xl mb-1">📧</p>
                  <p className="text-xs font-semibold text-orange-900">Sent</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-indigo-200">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
                  </svg>
                  What Happens Next?
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold flex-shrink-0">1.</span>
                    <span>Your feedback is securely stored</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold flex-shrink-0">2.</span>
                    <span>Quality team will analyze your responses</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold flex-shrink-0">3.</span>
                    <span>Improvements will be discussed with departments</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/students-feedback">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 sm:py-4 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base hover:cursor-pointer">
                    ✏️ Another Feedback
                  </button>
                </Link>
                
                <Link href="/">
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 sm:py-4 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base hover:cursor-pointer">
                    🏠 Back Home
                  </button>
                </Link>
              </div>

              <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600">
                  Redirecting in <span className="font-bold text-gray-800 text-base sm:text-lg">{countdown}s</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200">
              <div className="text-center space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold">Need Support?</span>
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <a href="mailto:gecv@gmail.com" className="hover:text-blue-600 transition flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    </svg>
                    <span className="hidden sm:inline">gecv@gmail.com</span>
                    <span className="sm:hidden">Email</span>
                  </a>
                  <span className="hidden sm:inline">•</span>
                  <a href="tel:+91-1112223331" className="hover:text-blue-600 transition flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.165 1.457 2.812 3.368 4.723s3.559 2.95 4.723 3.368l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="hidden sm:inline">+91-1112223331</span>
                    <span className="sm:hidden">Call</span>
                  </a>
                </div>
                <p className="text-xs text-gray-500 pt-2">
                  © 2024 Government Engineering College, Vaishali. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}