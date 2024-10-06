import React from 'react';
import { SunspotLoader } from "react-awesome-loaders";
import ''./LoadingAnimation.css';

export const SunspotLoaderComponent = () => {
  return (
    <div className="loader-container">
      <SunspotLoader
        gradientColors={["#6366F1", "#E0E7FF"]}
        shadowColor={"#3730A3"}
        desktopSize={"128px"}
        mobileSize={"100px"}
      />
    </div>
  );
};

export default LoadingAnimation;