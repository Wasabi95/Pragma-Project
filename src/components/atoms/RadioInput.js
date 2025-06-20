//src/components/atoms/RadioInput.js
import React from 'react';
import Label from './Label';  // Import your Label component

function RadioInput({ id, name, value, checked, onChange, label, className = "" }) {
  return (
    <div className={`form-check form-check-inline ${className}`}>
      <input
        className="form-check-input"
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <Label htmlFor={id} className="form-check-label">
        {label}
      </Label>
    </div>
  );
}

export default RadioInput;