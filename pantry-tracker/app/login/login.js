"use client"// client component
import React, {useEffect, useState} from 'react';
import reactDom from "react-dom";

import { Box,Typography,Button, TextField} from "@mui/material";
import { auth } from "../firebase.js";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword} from "firebase/auth"

export default function Login(){

    // state variables for email and password
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const router = useRouter();

    // Try sign in with firebase authentication
    const trySignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user)

          router.push('/Home')
        })
        .catch((error) => {
          alert("Your email or password is incorrect")
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }

    /**
     * Function to handle sign in when the sign in button is clicked
     */
    const handleSignIn = () => {
        if(email.length == 0 || password.length == 0){
            alert("Please enter an email address and password")
        }
        trySignIn()
        console.log(email)
    }
    
    const handleSignUp = () => {
        router.push("/signup")
    }

    return(
        <Box height="100vh" display={"flex"}  flexDirection={"column"} justifyContent={"center"} alignItems={"center"} sx={{margin:'auto'}}>
            <Box display={"flex"}  flexDirection={"column"} justifyContent={"center"} alignItems={"center"} border={"2px solid grey"} sx={{margin:'auto', padding:'10px'}}>
                <Typography variant='h4' sx={{margin:'5px'}}>Family Grocery Tracker</Typography>
                <TextField id="outlined-basic" label="Email address" variant="outlined" sx={{margin:'5px'}} value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField type='password' id="outlined-basic" label="Password" variant="outlined" sx={{margin:'5px'}} value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" sx={{margin:'5px'}} onClick={handleSignIn}>Sign In</Button>
                <Button variant="text" sx={{margin:'5px'}} onClick={handleSignUp}>Sign Up</Button>
            </Box>
        </Box>
    )

}