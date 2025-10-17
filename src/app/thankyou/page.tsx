// app/thankyou/page.tsx
import { Suspense } from 'react';
import ThankYouContent from './ThankYouContent'; // ✅ Move client code to separate file

// ✅ FORCE STATIC GENERATION - NO PRERENDER ERRORS!
export const dynamic = 'force-static';

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}