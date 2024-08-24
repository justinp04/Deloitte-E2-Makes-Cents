import React from 'react';
import PropTypes from 'prop-types';

// Logic for written text boxes

const TextInputBox = ({ label, type, id, placeholder, value, onChange, required }) => {
  return (
    <div className="form-group mb-3">
      <label htmlFor={id}>{label} {required && '*'}</label>
      <input
        type={type}
        className="form-control text-input-box"
        id={id}
        placeholder={placeholder || ''}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

//'Proptypes' allows you to specify the types and requirements of the props that a component should receive. 
// Helps catch potential bugs and ensure that components are used correctly by validating the props passed to them.

TextInputBox.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

TextInputBox.defaultProps = {
  type: 'text',
  placeholder: '',
  required: false,
};

export default TextInputBox;
