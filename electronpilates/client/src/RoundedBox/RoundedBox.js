import React from 'react';

import './RoundedBox.css';
const RoundedBox = ({ children, className = '', style = {} }) => {
  return (
    <div className={`rounded-box ${className}`} style={style}>
      {children}
    </div>
  );
};

export default RoundedBox;
