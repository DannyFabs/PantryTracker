"use client"// client component
import React, {useState} from 'react';

import { Box,Typography,Paper,TextField,Button} from "@mui/material";
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
                color: "#2C3E50", // deep color
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
                Login to ReStockd
                </Typography>

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
                onClick={handleSignIn}
                >
                Sign In
                </Button>

                <Button
                fullWidth
                variant="text"
                sx={{ color: "#2C3E50" }}
                onClick={handleSignUp}
                >
                Sign Up
                </Button>
            </Paper>
        </Box>
    )

}