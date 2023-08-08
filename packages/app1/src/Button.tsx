import React from 'react';

export const Button = (props: any) => (
  <span
    {...props}
    className={`
app1-rounded-md 
app1-border 
app1-border-gray-300 
app1-shadow-sm 
app1-bg-white 
app1-text-sm 
app1-font-medium 
app1-text-gray-700
hover:app1-bg-gray-50
focus:app1-outline-none
focus:app1-ring-2 
focus:app1-ring-offset-2
focus:app1-ring-offset-gray-100 
focus:app1-ring-indigo-500
app1-p-2
app1-m-2
app1-inline-block
`}
  />
);
