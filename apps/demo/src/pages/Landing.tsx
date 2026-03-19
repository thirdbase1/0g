import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        PulseStack
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl text-center">
        Fast products, not just fast routes. The product-first framework designed for vibecoders and fast builders.
      </p>
      <div className="mt-8 flex gap-4">
        <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Get Started
        </a>
        <a href="/docs" className="px-6 py-3 bg-white border border-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition">
          Documentation
        </a>
      </div>
    </div>
  );
}
