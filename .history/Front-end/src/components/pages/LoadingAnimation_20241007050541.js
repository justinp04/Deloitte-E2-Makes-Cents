import React from 'react';
import { XlviLoader } from "react-awesome-loaders";

const LoadingAnimation = () => {
  return (
    <>
      <XlviLoader
        boxColors={["#EF4444", "#F59E0B", "#6366F1"]}
        desktopSize={"128px"}
        mobileSize={"100px"}
      />
    </>
  );
};

export default LoadingAnimation; // Explicitly use default export