"use client"// client component
import React from 'react';
import reactDom from "react-dom";
import Login from "./login/login.js"


export default function Home(){
  return(
    <div>
      <Login/>
    </div>
  )
}