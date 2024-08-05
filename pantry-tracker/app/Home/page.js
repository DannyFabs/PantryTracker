"use client"// client component
import React from 'react';
import reactDom from "react-dom";

import Nav from "./nav.js"
import FunctionalBoxes from "./FunctionalBoxes.js"


export default function Home(){
  return(
    <div>
      <Nav />
      <FunctionalBoxes />
    </div>
  )
}