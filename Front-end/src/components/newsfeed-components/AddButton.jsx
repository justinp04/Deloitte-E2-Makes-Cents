import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AddButton = () => {
    return (
        <Dropdown className="me-3 ms-3 add-button" style={{ border: 'none' }}>
            <Dropdown.Toggle
                as={Nav.Link}
                className="fw-bold p-0 no-caret"
                style={{ border: 'none', backgroundColor: 'transparent' }}
            >
                <FontAwesomeIcon
                    icon={faPlus}
                    style={{ height: '2rem', width: '2rem', color: 'white' }}
                    className="align-items-center"
                />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as={Link} to="">
                    Add new current investment
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="">
                    Add new following
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="">
                    Edit List
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default AddButton;
