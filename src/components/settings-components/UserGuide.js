import React from 'react';

const UserGuide = () => {
    const activateTutorial = () => {
        localStorage.setItem('showTutorial', 'true'); // Set flag in localStorage
        alert("Tutorial will be shown next time you visit the Stock Analysis page.");
    };

    return (
        <div>
            <h2 className='fw-bold ms-3'>User Guide</h2>
            <button onClick={activateTutorial} className="btn btn-primary ms-3 mt-3">Start Tutorial</button>
        </div>
    );
};

export default UserGuide;
