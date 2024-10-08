import React from 'react';

export const RatingIcon = ({
  color1 = '#f39c12',
  color2 = '#f1c40f',
  width = '128px',
  height = '128px',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // xmlns:xlink="http://www.w3.org/1999/xlink"
      // xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      // xmlns:cc="http://creativecommons.org/ns#"
      // xmlns:dc="http://purl.org/dc/elements/1.1/"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      version="1.1"
      {...props}
    >
      <g transform="translate(0 -1028.4)">
        <path
          d="m9.533-0.63623 2.79 6.2779 5.581 0.6976-4.186 3.4877 1.395 6.278-5.58-3.488-5.5804 3.488 1.3951-6.278-4.1853-3.4877 5.5804-0.6976z"
          transform="matrix(1.4336 0 0 1.4336 -1.6665 1029.3)"
          fill={color1}
        />
        <g fill={color2}>
          <g>
            <path d="m12 0v13l4-4z" transform="translate(0 1028.4)" />
            <path d="m12 13 12-3-6 5z" transform="translate(0 1028.4)" />
            <path d="m12 13 8 11-8-5z" transform="translate(0 1028.4)" />
            <path d="m12 13-8 11 2-9z" transform="translate(0 1028.4)" />
          </g>
          <path d="m12 13-12-3 8-1z" transform="translate(0 1028.4)" />
        </g>
      </g>
    </svg>
  );
};
