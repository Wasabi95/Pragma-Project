//src/components/atoms/Input.js
import React from 'react';

function Input({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  required = false, 
  autoFocus = false,
  checked,
  name
}) {
  const commonProps = {
    id,
    value,
    onChange,
    placeholder,
    required,
    autoFocus,
    name,
    className: "form-control"
  };

  if (type === 'textarea') {
    return <textarea {...commonProps} rows="2"></textarea>;
  } else if (type === 'radio') {
    return <input 
      type={type} 
      {...commonProps} 
      checked={checked}
      className="form-check-input" // Different class for radios
    />;
  }
  
  return <input type={type} {...commonProps} />;
}
export default Input;