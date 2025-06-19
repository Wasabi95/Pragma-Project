//src/components/atoms/Badge.js
import React from 'react';

function Badge({ children, type = 'primary' }) {
  return <span className={`badge bg-${type} fs-6`}>{children}</span>;
}

export default Badge;