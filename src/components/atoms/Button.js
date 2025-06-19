//src/components/atoms/Button.js
import React from 'react';

function Button({ onClick, children, disabled = false, className = 'btn-primary', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;