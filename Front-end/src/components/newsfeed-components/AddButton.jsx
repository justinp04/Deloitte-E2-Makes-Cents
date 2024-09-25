/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Elipsis button that allows user to add company news to following or current investment list
 ************************************************************************************************/
import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const AddButton = ({ onAddNewInvestment, onAddNewFollowing }) => {
    return (
        <Dropdown className="ms-5 mt-1" style={{ border: 'none' }}>
            <Dropdown.Toggle
                as={Nav.Link}
                className="fw-bold p-0 no-caret"
                style={{ border: 'none', backgroundColor: 'transparent' }}
            >
                <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    style={{ height: '1.2rem', width: '1.2rem', color: 'black' }}
                />
            </Dropdown.Toggle>
            {/* Dropdown options */}
            <Dropdown.Menu>
                <Dropdown.Item onClick={onAddNewInvestment}>
                    Add to Current Investments
                </Dropdown.Item>
                <Dropdown.Item onClick={onAddNewFollowing}>
                    Add to Following
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default AddButton;