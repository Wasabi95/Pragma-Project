//src/components/1-atoms/Label.js
import React from 'react';

const Label = ({ htmlFor, children, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`form-label fw-bold ${className}`}>
      {children}
    </label>
  );
};

export default Label;
