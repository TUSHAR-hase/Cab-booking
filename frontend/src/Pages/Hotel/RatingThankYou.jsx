import { Link } from 'react-router-dom';
import React, { useState } from 'react';

export default function RatingThankYou() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-8 border-2 border-red-600 text-center">
                <div className="text-5xl text-red-500 mb-4">✓</div>
                <h1 className="text-2xl font-bold text-red-500 mb-4">Thank You!</h1>
                <p className="text-gray-300 mb-6">
                    Your rating has been submitted successfully.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}