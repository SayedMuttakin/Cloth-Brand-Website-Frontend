
import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ isExiting }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (!isExiting) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 95) { // Stop just before 100 to allow for fade out
            return prevProgress + 1;
          } else {
            clearInterval(interval);
            return prevProgress;
          }
        });
      }, 50); // Increment progress every 50ms
    }

    return () => clearInterval(interval);
  }, [isExiting]);

  useEffect(() => {
    if (isExiting) {
      setProgress(100); // Ensure it hits 100% before fading out
    }
  }, [isExiting]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="text-center w-full max-w-md px-4">
        {/* Logo Placeholder */}
        <div className="mx-auto mb-8 h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
          <div 
            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Progress Percentage */}
        <p className="text-sm font-medium text-indigo-200/60 mb-2">
          {progress}%
        </p>

        {/* Loading Message */}
        <p className="text-lg font-medium text-indigo-200/60">
          Loading your shopping experience...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
