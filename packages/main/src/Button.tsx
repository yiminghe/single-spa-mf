import React from 'react';

export const Button = (props: any) => (
  <span
    {...props}
    className={`
main-rounded-md 
main-border 
main-border-gray-300 
main-shadow-sm 
main-bg-white 
main-text-sm 
main-font-medium 
main-text-gray-700
hover:main-bg-gray-50
focus:main-outline-none
focus:main-ring-2 
focus:main-ring-offset-2
focus:main-ring-offset-gray-100 
focus:main-ring-indigo-500
main-p-2
main-m-2
main-inline-block
`}
  />
);
