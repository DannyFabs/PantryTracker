"use client"// client component
import React, {useState} from 'react';

import { Box,Typography,Button, TextField, Paper } from "@mui/material";
import { firestore, auth } from "../firebase.js";
import {doc,setDoc} from 'firebase/firestore'
import { useRouter } from "next/navigation";
import {createUserWithEmailAndPassword} from 'firebase/auth'


import { User, userConverter } from '../objects/User.js';

export default function Login(){

    // state variables for email, password and display name
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')

    const router = useRouter();

    // Connect to firestore to Create a new user
    const addNewUser = async(user) => {
        const ref = doc(firestore, "Usersv2", user.uid).withConverter(userConverter)
        //add a check to see if the user exist.
        await setDoc(ref, new User(user.uid,user.email,displayName,[]))
    }

    /**
     * Link to firestore to create a new user with the email and password
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
     * Function to handle when the signup button is clicked
     */
    const handleSignUp = () => {
        if(email.length == 0 || password.length==0 || displayName.length == 0){
            alert("Please enter a value for all fields")
        }
        trySignUp()
    }

    const handleSignIn = () => {
        router.push("/")
    }

    return(
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{
                background: "linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)",
                pt: 10, // padding from top
            }}
        >
            <Typography
                variant="h3"
                sx={{
                fontWeight: 700,
                color: "#2C3E50",
                mb: 6,
                }}
            >
                ReStockd
            </Typography>
             {/* Login Card */}
            <Paper
                elevation={4}
                sx={{
                width: "90%",
                maxWidth: 400,
                p: 4,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#ffffff",
                }}
            >
                <Typography variant="h5" sx={{ mb: 3, color: "#34495E" }}>
                    Join ReStockd
                </Typography>

                {/* DisplayName */}
                <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                sx={{ mb: 2 }}
                />

                {/* Email */}
                <TextField
                fullWidth
                label="Email address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                />

                {/* Password */}
                <TextField
                fullWidth
                type="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                />

                <Button
                fullWidth
                variant="contained"
                sx={{
                    mb: 2,
                    backgroundColor: "#2C3E50",
                    "&:hover": { backgroundColor: "#1A252F" },
                }}
                onClick={handleSignUp}
                >
                Sign Up
                </Button>

                <Button
                fullWidth
                variant="text"
                sx={{ color: "#2C3E50" }}
                onClick={handleSignIn}
                >
                Sign In
                </Button>
            </Paper>
        </Box>
    )

}