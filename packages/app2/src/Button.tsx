import React from 'react';

export const Button = (props) => (
  <span
    {...props}
    className={`
app2-rounded-md 
app2-border 
app2-border-gray-300 
app2-shadow-sm 
app2-bg-white 
app2-text-sm 
app2-font-medium 
app2-text-gray-700
hover:app2-bg-gray-50
focus:app2-outline-none
focus:app2-ring-2 
focus:app2-ring-offset-2
focus:app2-ring-offset-gray-100 
focus:app2-ring-indigo-500
app2-p-2
app2-m-2
app2-inline-block
`}
  />
);
