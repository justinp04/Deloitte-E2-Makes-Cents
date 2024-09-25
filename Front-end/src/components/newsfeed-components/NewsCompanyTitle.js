/************************************************************************************************
 * Authors: Alyssha Kwok
 * Purpose: Company stock title on news feed page
 ************************************************************************************************/
import React from "react";
import '../pages/NewsFeed.css';
import { Container, Row, Col } from 'react-bootstrap';

const NewsCompanyTitle = ({ textContent }) => {
    return (
        <Container className="company-title-div">
            <Row>
                <Col className="fw-bold company-title-text">
                    News Feed
                </Col>
            </Row>
            <Row>
                <Col className="fw-bold" style={{fontSize:"130%"}}>
                    {textContent}
                </Col>
            </Row>
        </Container>
    );
}

export default NewsCompanyTitle;
