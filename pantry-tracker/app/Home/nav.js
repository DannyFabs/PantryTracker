"use client"// client component
import { Box,Typography,Button, AppBar, IconButton, Toolbar } from "@mui/material";
import React from 'react';
import reactDom from "react-dom";

export default function Nav(){
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
        </Toolbar>
      </AppBar>
    </Box>
  )
}

