/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Sidebar on news feed page
 ************************************************************************************************/
import React, { useState } from 'react';
import { Dropdown, Nav, Accordion, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar';
import '../pages/NewsFeed.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const NewsSidebar = ({onSearch}) => {
    const [expandedItem, setExpandedItem] = useState(false);

    const handleToggle = (eventKey) => {
        setExpandedItem(expandedItem === eventKey ? null : eventKey);
    };

    return (
        <div className="flex flex-direction-column justify-content-between p-0 mt-4">
            <Container fluid className="m-0 p-0">
                <SearchBar placeholder="Search a stock onSearch={onSearch}" />
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header className={`d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === "0" ? 'focus' : ''}`} onClick={() => handleToggle("0")}>
                            <FontAwesomeIcon
                                id="stockRecommendations"
                                icon={faChevronRight}
                                className={`chevron-icon ${expandedItem === "0" ? 'rotate' : ''}`} />
                            <p className="my-0 ps-3 fw-bold">Current Investments</p>
                        </Accordion.Header>
                        <Accordion.Body className="ps-4 pe-1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                            culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header className={`d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === "1" ? 'focus' : ''}`} onClick={() => handleToggle("1")}>
                            <FontAwesomeIcon
                                id="stockRecommendations"
                                icon={faChevronRight}
                                className={`chevron-icon ${expandedItem === "1" ? 'rotate' : ''}`} />
                            <p className="my-0 ps-3 fw-bold">Following</p>
                        </Accordion.Header>
                        <Accordion.Body className="ps-4 pe-1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                            culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header className={`d-inline-flex justify-content-between align-items-centre w-100 ${expandedItem === "2" ? 'focus' : ''}`} onClick={() => handleToggle("2")}>
                            <FontAwesomeIcon
                                id="NewsFeedSearch"
                                icon={faChevronRight}
                                className={`chevron-icon ${expandedItem === "2" ? 'rotate' : ''}`} />
                            <p className="my-0 ps-3 fw-bold">Search Result</p>
                        </Accordion.Header>
                        <Accordion.Body className="ps-4 pe-1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                            culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container >

            <Dropdown className="me-3 ms-3 add-button" style={{ border: 'none' }}>
                <Dropdown.Toggle
                    as={Nav.Link}
                    className="fw-bold p-0 no-caret"
                    style={{ border: 'none', backgroundColor: 'transparent' }}>
                    <FontAwesomeIcon
                        icon={faPlus}
                        style={{
                            height: '2rem',
                            width: '2rem',
                            color: 'white'
                        }}
                        className="align-items-center" />
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
        </div >
    );
}
export default NewsSidebar;