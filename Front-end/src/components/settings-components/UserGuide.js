import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserGuide = () => {

    const navigate = useNavigate();

    const activateTutorial = () => {
        localStorage.setItem('showTutorial', 'true'); // Set flag in localStorage
        navigate('/stock-analysis');
    };

    return (
        <div>
            <h2 className='fw-bold ms-3'>User Guide</h2>
            <button onClick={activateTutorial} className="btn btn-primary ms-3 mt-3">Start Tutorial</button>
        </div>
    );
};

export default UserGuide;