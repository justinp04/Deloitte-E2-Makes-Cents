/************************************************************************************************
 * Purpose: Summary portion for stock in 'Stock Analysis' page
 * Fix: 
 ************************************************************************************************/
import React, { useState } from 'react';

import '../Components.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';


const StockSummary = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="toggle-list-container">
      <div 
        onClick={toggleList} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
        <h6 style={{ marginLeft: '10px', fontWeight: 'bold' }}>
          {title}
        </h6>
      </div>
      {isOpen && (
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>  
      )}
    </div>
  );
};

export default StockSummary;



// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
// import '../ToggleList.css';
// import FavoriteButton from '../stockanalysis-components/FavouriteButton';
// import ToggleSwitch from '../ToggleSwitch';

// const StockSummary = ({ title, items }) => {
//   const [isOpen, setIsOpen] = useState(false);  // Define isOpen state
//   const [isChecked, setIsChecked] = useState(false);

//   const toggleList = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleChange = () => {
//     setIsChecked(!isChecked);
//   };

//   return (
//     <div className="toggle-list-container">
//       <div className="toggle-list-header" onClick={toggleList}>
//         <div className="title-icon">
//           <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />
//           <h6 className="title-text">
//             {title}
//           </h6>
//         </div>
//         <div className="action-buttons">
//           <FavoriteButton />
//           <ToggleSwitch
//             checked={isChecked}
//             onChange={handleChange}
//             id="detaildSummarySwitch"
//           />
//         </div>
//       </div>
//       {isOpen && (
//         <ul className="toggle-list-items">
//           {items.map((item, index) => (
//             <li key={index}>{item}</li>
//           ))}
//         </ul>  
//       )}
//     </div>
//   );
// };

// export default StockSummary;

