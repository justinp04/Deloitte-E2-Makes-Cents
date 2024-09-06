/************************************************************************************************
 * Purpose: Sidebar for News Feed Page
 * Fix:
 *  - Colour
 ************************************************************************************************/
import React, { useRef } from 'react';
import { Button, Dropdown, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import SearchBar from '../SearchBar';
import '../pages/NewsFeed.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const NewsSidebar = () => {
    const isOpen = useRef(false); 
    // Using a ref now so that it persist across renders, without re-rendering the component upon changing
    // This ensures that we still have our smooth animations

    const toggleAccordion = () => {
        isOpen.current = !isOpen.current;
    };

    return (
        <div className="p-0 mt-4">
            <SearchBar placeholder="Search A Stock" />
            {/* <ToggleList /> */}

            {/* <Button 
                className='add-button'>
            </Button> */}

            <Dropdown align="end" className="me-3 ms-3 add-button" style={{ border: 'none' }}>
                <Dropdown.Toggle
                    as={Nav.Link}
                    className="fw-bold p-0 no-caret"
                    style={{ border: 'none', backgroundColor: 'transparent' }}
                >
                    <FontAwesomeIcon
                        icon={faPlus}
                        style={{
                            height: '2rem',
                            width: '2rem',
                            color: 'white'
                        }}
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

            <div id="accordion" >
                <div className="card w-300" style={{ border: 'none', backgroundColor: 'transparent' }}>
                    <div className="card-header ps-0 w-300" id="headingOne" style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <h5 className="mb-0">
                            <button
                                className="accordion-button d-flex align-items-center"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="true"
                                aria-controls="collapseOne"
                                // onClick={toggleAccordion} //toggleAccordian() calls the method, so do not include the parenthesis
                            >
                                <FontAwesomeIcon
                                    icon={isOpen? faChevronRight : faChevronDown}
                                    className="me-2"
                                />
                                <span>Stock Recommendations</span>
                            </button>
                        </h5>
                    </div>

                    <div
                        id="collapseOne"
                        className={`collapse ${isOpen ? 'show' : ''}`}
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordion"
                    >
                        <div className="card-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                        </div>
                    </div>
                </div>
                <div className="card w-300" style={{ border: 'none', backgroundColor: 'transparent' }}>
                    <div className="card-header ps-0 w-300" id="headingTwo " style={{ border: 'none', backgroundColor: 'transparent' }}>
                        <h5 className="mb-0">
                            <button
                                className="accordion-button d-flex align-items-center"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                            >
                                <FontAwesomeIcon
                                    icon={isOpen ? faChevronDown : faChevronRight}
                                    className="me-2"
                                />
                                <span>Following</span>
                            </button>
                        </h5>
                    </div>
                    <div
                        id="collapseTwo"
                        className="collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordion"
                    >
                        <div className="card-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                            <Button></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default NewsSidebar;