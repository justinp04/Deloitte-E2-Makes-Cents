import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingAnimation = () => {
  return (
    <div className="loader-container">
      <ClipLoader color="#6366F1" size={150} />
    </div>
  );
};

export default LoadingAnimation;