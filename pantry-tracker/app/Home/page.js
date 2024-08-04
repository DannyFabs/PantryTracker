"use client"// client component
import { Box, Stack,Typography,Button, Modal, TextField } from "@mui/material";
import { firestore } from "../firebase.js";
import {collection, doc, getDocs,query,setDoc, deleteDoc, getDoc} from 'firebase/firestore'
import React, {useEffect, useState} from 'react';
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