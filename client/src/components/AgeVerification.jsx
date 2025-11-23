import React, { useState, useEffect } from 'react';

export default function AgeVerification({ onVerified }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const isVerified = localStorage.getItem('age_verified');
    if (isVerified === 'true') {
      onVerified();
    }
  }, [onVerified]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!day || !month || !year) {
      setError('Please fill in all fields');
      return;
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 18) {
      localStorage.setItem('age_verified', 'true');
      onVerified();
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2 text-yellow-500">Age Verification</h1>
        <p className="text-gray-400 mb-8">You must be 18 or older to enter.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 justify-center">
            <input
              type="number"
              placeholder="DD"
              min="1"
              max="31"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-20 bg-gray-800 border border-gray-700 rounded-lg p-3 text-center text-xl focus:border-yellow-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="MM"
              min="1"
              max="12"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-20 bg-gray-800 border border-gray-700 rounded-lg p-3 text-center text-xl focus:border-yellow-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="YYYY"
              min="1900"
              max={new Date().getFullYear()}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-28 bg-gray-800 border border-gray-700 rounded-lg p-3 text-center text-xl focus:border-yellow-500 focus:outline-none"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-yellow-400 transition-colors"
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
}
