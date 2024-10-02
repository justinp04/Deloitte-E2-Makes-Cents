/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Company stock title on news feed page
 ************************************************************************************************/
import React from "react";
import '../pages/NewsFeed.css';
import { Container, Row, Col} from 'react-bootstrap';
import AddButton from "./AddButton";

const NewsCompanyTitle = ({ textContent, onAddNewInvestment, onAddNewFollowing}) => {
    return (
        <div className="company-title-div">
            <Row>
                {/* Page title */}
                <Col className="page-title-text">
                    News Feed
                </Col>
            </Row>
            <Row>
                {/* Company name  */}
                <Col className="page-subtitle1-text">
                    {textContent}
                </Col>
                <Col className="d-flex justify-content-end">
                    {/* Add button to add company news feed to user list  */}
                    <AddButton 
                        className="mt-2"
                        onAddNewInvestment={onAddNewInvestment}
                        onAddNewFollowing={onAddNewFollowing}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default NewsCompanyTitle;