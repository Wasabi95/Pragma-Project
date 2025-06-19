//src/components/atoms/Input.js
import React from 'react';

function Input({ id, value, onChange, placeholder, type = 'text', required = false, autoFocus = false }) {
  const commonProps = {
    id,
    value,
    onChange,
    placeholder,
    required,
    autoFocus,
    className: "form-control"
  };

  return type === 'textarea' ? (
    <textarea {...commonProps} rows="2"></textarea>
  ) : (
    <input type={type} {...commonProps} />
  );
}

export default Input;