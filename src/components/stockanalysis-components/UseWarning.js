/************************************************************************************************
 * Purpose: Stock Analysis warning sign at the bottom of the page
 * Fix: 
 *  - NOT IN USE (MIGHT DELETE) AS IT HAS BEEN USED IN QUERYINPUTBAR.JS
 ************************************************************************************************/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const UseWarning = () => {
    return(
        <div className='d-flex warning'>
            <p>Makes Cents is not a financial advisor, investing is a risky venture and you actions are done at your own risk</p>
        </div>
    );
}

export default UseWarning;