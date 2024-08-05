"use client"// client component
import { Box,Typography,Button, AppBar, IconButton, Toolbar } from "@mui/material";
import React from 'react';
import reactDom from "react-dom";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";


export default function Nav(){

  const router = useRouter()

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      router.push('/')
    }).catch((error) => {
      // An error happened.
      alert("Working on this.....")
    });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="#2c5494"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Family Grocery Tracker
          </Typography>
          <Button color="error" variant="contained" onClick={handleSignOut}>Sign Out</Button>        
          </Toolbar>
      </AppBar>
    </Box>
  )
}

