import React from 'react';
import { clsx } from 'clsx';

/**
 * Reusable Card container with soft shadow and hover lift effect.
 */
const Card = ({ children, className = '', padding = true, hover = true }) => {
  return (
    <div
      className={clsx(
        'card',
        padding && 'p-6',
        !hover && 'hover:shadow-none hover:transform-none',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
