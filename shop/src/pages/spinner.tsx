import React from 'react';

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="w-12 h-12 border-t-4 border-b-4 border-brand rounded-full animate-spin"></div>
    <p className="text-xl font-semibold text-brand dark:text-white ml-3">Loading...</p>
  </div>
);

export default Spinner;