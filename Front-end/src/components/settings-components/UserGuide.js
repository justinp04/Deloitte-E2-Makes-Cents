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
            <button
                onClick={activateTutorial}
                className="green-btn"
                style={{width: '150px'}}
            >
            Start Tutorial
            </button>
        </div>
    );
};

export default UserGuide;