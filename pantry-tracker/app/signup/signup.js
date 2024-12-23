"use client"// client component
import React, {useEffect, useState} from 'react';
import reactDom from "react-dom";

import { Box, Stack,Typography,Button, Modal, TextField,Tooltip, tooltipClasses, styled } from "@mui/material";
import { Home } from "@mui/icons-material";
import { firestore, auth } from "../firebase.js";
import {collection, doc, getDocs,query,setDoc, deleteDoc, getDoc} from 'firebase/firestore'
import { useRouter } from "next/navigation";
import {createUserWithEmailAndPassword} from 'firebase/auth'


import { User, userConverter } from '../objects/User.js';

export default function Login(){

    // state variables for email and password
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const router = useRouter();

    // Connect to firestore to Create a new user
    const addNewUser = async(user) => {
        const ref = doc(firestore, "Users", email).withConverter(userConverter)
        //add a check to see if the user exist.
        await setDoc(ref, new User(email,[],[],[],[]))
    }

    /**
     * Link to dynamodb to create a new user with the email and password
     */
    const trySignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;

        //   log user into firestore db
          addNewUser(user);
          router.push('/')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }

    /**
     * Function to handle sign up when the signup button is clicked
     */
    const handleSignUp = () => {
        if(email.length == 0 || password.length==0){
            alert("Please enter a valid email address and password")
        }
        trySignUp()
    }

    return(
        <Box height="100vh" display={"flex"}  flexDirection={"column"} justifyContent={"center"} alignItems={"center"} sx={{margin:'auto'}}>
            <Box display={"flex"}  flexDirection={"column"} justifyContent={"center"} alignItems={"center"} border={"2px solid grey"} sx={{margin:'auto', padding:'10px'}}>
                <Typography variant='h4' sx={{margin:'5px'}}>Family Grocery Tracker</Typography>
                <TextField id="outlined-basic" label="Email address" variant="outlined" sx={{margin:'5px'}} value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField type='password' id="outlined-basic" label="Password" variant="outlined" sx={{margin:'5px'}} value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" sx={{margin:'5px'}} onClick={handleSignUp}>Sign Up</Button>
            </Box>
        </Box>
    )

}