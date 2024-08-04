"use client"// client component
import { Box, Grid,Typography,Paper, Button, TextField, Modal} from "@mui/material";
import { styled } from '@mui/material/styles';
import React, {useEffect, useState} from 'react';
import { useRouter } from "next/navigation";
import reactDom from "react-dom";
import Cookies from "js-cookie";

import { auth, firestore } from "../firebase";
import {collection, doc, getDocs,query, getDoc,setDoc, updateDoc, arrayUnion} from 'firebase/firestore'


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
  const [personalPantry, setPersonalPantry] = useState([])
  // const [personalGrocery, setPersonalGrocery] = useState([])

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [newName, setNewName] = useState('')



  const router = useRouter()

  const visitPantry = (pantryName) =>{
    Cookies.set('currentPantry', pantryName)
    router.push("/component")
  }

  const visitGrocery = (groceryListName) =>{
    Cookies.set('currentGrocery', groceryListName)
    router.push("/grocery")
  }

  const getPersonalPantry = async() =>{
    const user = auth.currentUser
    const mail = user.email

    const userRef = doc(firestore,'Users',mail)
    const docSnap = await getDoc(userRef)
    let pp = []
    if(docSnap.exists()){
      pp = docSnap.data()['pp']
      console.log(pp)
    }
    else{
      alert("Something went wrong. Please login and try again")
    }
    return pp
  }

  
  const updatePersonalPantry = async() => {
    const pp = await getPersonalPantry()
    setPersonalPantry(pp)
  }

  const addGrocery = async() => {
    // pantry and grocery are set up together
    const user = auth.currentUser
    const mail = user.email
    const groceryName = newName+"-"+ mail

    const groceryRef = doc(firestore,'Grocery',groceryName)

    const docSnap = await getDoc(groceryRef)
    if(docSnap.exists()){
      alert("A grocery/shopping list with this name already exist.Choose another name.")
    }
    else{
      // add new pantry item
      // note pantries are created alongside
      await setDoc(groceryRef,{items:{}}) 
      // add pantry id to list of personal pantries for the current user
      const userRef = doc(firestore,'Users',mail)

      await updateDoc(userRef, {
        pg: arrayUnion(groceryName)
      })
    }
    // updatePersonalPantry()
  }

  const addPantry = async() => {

    // pantry and grocery are set up together
    const user = auth.currentUser
    const mail = user.email
    const pantryName = newName.toLowerCase() +"-"+ mail

    const pantryRef = doc(firestore,'Pantry',pantryName)

    const docSnap = await getDoc(pantryRef)
    if(docSnap.exists()){
      alert("A pantry/inventory with this name already exist.Choose another name.")
    }
    else{
      // add new pantry item
      // note pantries are created alongside
      await setDoc(pantryRef,{items:{}}) 
      // add pantry id to list of personal pantries for the current user
      const userRef = doc(firestore,'Users',mail)

      await updateDoc(userRef, {
        pp: arrayUnion(pantryName)
      })

      // add the matching grocery list
      addGrocery()
      updatePersonalPantry()
    }
  }



  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    gap:2
  };
  
  
  // const isLoggedIn = () => {
  //   const user = auth.currentUser
  //   if(user){
  //     return true
  //   }
  //   else{
  //     return false
  //   }
  // }

  useEffect(() => {
    // if(!isLoggedIn()){
    //   alert("Your user has been logged out please log in.")
    //   Cookies.remove('userEmail')
    //   router.push('/')
    // }
    updatePersonalPantry()
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
            {/* create modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Pantry
          </Typography>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
            <TextField id="outlined-basic" label={"Pantry name"}variant="outlined" value={newName} onChange= {(e) => {setNewName(e.target.value)}}/>
            <Button variant="outlined" 
              onClick={() => {
              addPantry()
              handleClose()
               }}>Create
              </Button>
          </Box>
        </Box>
      </Modal>

      <Box>
        <Box display={"flex"} justifyContent={"space-between"} margin={"15px"}>
          <Typography variant="h4" >My Pantry and Grocery Lists</Typography>
          <Button variant="contained" onClick={handleOpen}>Create Pantry</Button>
        </Box>

          {personalPantry.length == 0 ? (
              <Grid item xs={12}>
                <Typography variant="h5" margin={"5px"} textAlign={"center"} color={"grey"}>You have no pantry/inventory at this time</Typography>
              </Grid>
          ) : (
            <Box width={"100%"} height={"35%"} overflow={"auto"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
              {personalPantry.map((pantryNm) => {
                const name = pantryNm.split("-")[0]

                return(
                  <Grid key={name} container rowspacing={1} marginBottom={"40px"}>
                    <Grid item md={6} xs={12} >
                      <Item sx={hover} onClick={() =>{visitPantry(name)}}>{name} Pantry</Item>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Item sx={hover} onClick={() =>{ visitGrocery(name)}}>{name} Grocery</Item>
                    </Grid>
                  </Grid>
                )
              })
            }
            </Box>
          )
        }
      </Box>
      <Box>
          <Typography variant="h4" margin={"5px"} textAlign={"center"}>Shared With Me</Typography>
      </Box>
    </Box>
  );
}
