import React from "react";
import {Row, Col} from 'react-bootstrap';

const SettingsTitle = ({textContent, pageInformationText}) => {
    return (
        <div className="company-title-div">
            <Row>
                {/* Page title */}
                <Col className="page-title-text">
                    Settings
                </Col>
            </Row>
            <Row>
                {/* Company name  */}
                <Col className="page-subtitle1-text">
                    {textContent}
                </Col>
            </Row>
            <Row>
                <Col className="page-normal-text">
                    {pageInformationText}
                </Col>
            </Row>
        </div>
    );
}

export default SettingsTitle;