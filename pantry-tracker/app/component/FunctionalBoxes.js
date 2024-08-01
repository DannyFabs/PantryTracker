"use client"// client component
import { Box, Grid,Typography,Paper} from "@mui/material";
import { styled } from '@mui/material/styles';
import React, {useEffect, useState} from 'react';
import { useRouter } from "next/navigation";
import reactDom from "react-dom";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.h4,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    height: "150px",
    margin: "20px",
    border: '1px solid #ccc',
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }));
  
const hover = {
    ":hover":{
        cursor:"pointer"
    }
}
const gridItemStyle = {
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    border: '1px solid #ccc',
    // margin: '5px 5px'
  };

export default function FunctionalBoxes(){

  const router = useRouter()

  const visitPantry = () =>{
    router.push("./component")
  }

    return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item sx={hover} onClick={visitPantry}>My Pantry Items</Item>
        </Grid>
        <Grid item xs={6}>
          <Item sx={hover}>Grocery List</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
