//src/components/molecules/FormField.js
import React from 'react';
import Input from '../atoms/Input';

function FormField({ label, id, ...inputProps }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <Input id={id} {...inputProps} />
    </div>
  );
}

export default FormField;