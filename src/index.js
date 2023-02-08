import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './/views/home/Home'

import { createBrowserRouter,RouterProvider  } from 'react-router-dom';

const router = createBrowserRouter(

  [

    {
    
    path: "/",
    element: <Home/>,
    
  }]
   
);


ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
