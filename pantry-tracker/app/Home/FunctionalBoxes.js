"use client"// client component
import { Box, Grid,Typography,Paper, Button, TextField, Modal, Stack} from "@mui/material";
import { styled } from '@mui/material/styles';
import React, {useEffect, useState} from 'react';
import { useRouter } from "next/navigation";
import reactDom from "react-dom";
import Cookies from "js-cookie";

import { auth, firestore } from "../firebase";
import { doc, getDoc,setDoc, updateDoc, arrayUnion} from 'firebase/firestore'
import { onAuthStateChanged } from "firebase/auth";


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
  };

export default function FunctionalBoxes(){

  // user state variable
  const [currUser, setUser] = useState(null)

  // pantry state variables
  const [personalPantry, setPersonalPantry] = useState([])
  const [sharedPantry, setSharedPantry] = useState([])

  // modal state variables
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [shareOpen, setShareOpen] = React.useState(false);
  const handleShareOpen = () => setShareOpen(true);
  const handleShareClose = () => setShareOpen(false);

  const [newName, setNewName] = useState('')
  const [shareEmail, setShareEmail] = useState('')
  const [sharePantry, setSharePantry] = useState('')



  const router = useRouter()

  /**
   * Visit a pantry List
   * @param {String} pantryName The name of a pantry
   */
  const visitPantry = (pantryName) =>{
    Cookies.set('currentPantry', pantryName)
    router.push("/component")
  }

  /**
   * Visit a grocery list page
   * @param {string} groceryListName The name of grocery list
   */
  const visitGrocery = (groceryListName) =>{
    Cookies.set('currentGrocery', groceryListName)
    router.push("/grocery")
  }

  /**
   * Get a logged in users list of personal pantries
   * @returns {list} List of personal pantry's
   */
  const getPersonalPantry = async() =>{
    // const user = auth.currentUser
    if(currUser){
      const mail = currUser.email

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
    else{
      return []
    }

  }

  /**
   * Get a logged in users list of shared pantry'
   * @returns {list} List of shared pantry's
   */
  const getSharedPantry = async() =>{
    // const user = auth.currentUser
    if(currUser){
      const mail = currUser.email

      const userRef = doc(firestore,'Users',mail)
      const docSnap = await getDoc(userRef)
      let pp = []
      if(docSnap.exists()){
        pp = docSnap.data()['sp']
        console.log(pp)
      }
      else{
        alert("Something went wrong. Please login and try again")
      }
      return pp
    }
    else{
      return []
    }
  }

  const updateSharedPantry = async() => {
    const sp = await getSharedPantry()
    setSharedPantry(sp)
  }
  
  const updatePersonalPantry = async() => {
    const pp = await getPersonalPantry()
    setPersonalPantry(pp)
  }

  /**
   * Add a new grocery list to all grocery lists
   */
  const addGrocery = async() => {
    // pantry and grocery are set up together
    const mail = currUser.email

    const groceryName = newName.toLowerCase()+"-"+ mail

    const groceryRef = doc(firestore,'Grocery',groceryName)

    const docSnap = await getDoc(groceryRef)
    if(docSnap.exists()){
      alert("A grocery/shopping list with this name already exist.Choose another name.")
    }
    else{
      // add new pantry item
      // note pantries are created alongside
      await setDoc(groceryRef,{items:[]}) 
      // add pantry id to list of personal pantries for the current user
      const userRef = doc(firestore,'Users',mail)

      await updateDoc(userRef, {
        pg: arrayUnion(groceryName)
      })
    }
    // updatePersonalPantry()
  }

  /**
   * Add a new pantry list to all pantry lists
   */
  const addPantry = async() => {

    // pantry and grocery are set up together
    const mail = currUser.email

    const pantryName = newName.toLowerCase() +"-"+ mail

    const pantryRef = doc(firestore,'Pantry',pantryName)

    const docSnap = await getDoc(pantryRef)
    if(docSnap.exists()){
      alert("A pantry/inventory with this name already exist.Choose another name.")
    }
    else{
      // add new pantry item
      // note pantries are created alongside
      await setDoc(pantryRef,{items:[]}) 
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

  /**
   * Function to check if a pantry exists. True if it exist false otherwise.
   * @returns {boolean} True or false
   */
  const pantryExist = async() => {
        // pantry and grocery are set up together
        // const user = auth.currentUser
        // const mail = user.email
        const mail = currUser.email

        const pantryName = sharePantry.toLowerCase() +"-"+ mail
    
        const pantryRef = doc(firestore,'Pantry',pantryName)
    
        const docSnap = await getDoc(pantryRef)
        if(docSnap.exists()){
          return true
        }
        else{
          return false
        }
  }

  /**
   * Function to check if a user exists. True if it exist false otherwise.
   * @returns {boolean} True or false
   */
  const userExist = async() => {
    const mail = shareEmail.toLowerCase()

    const userRef = doc(firestore, 'Users', mail)
    const docSnap = await getDoc(userRef)
    if(docSnap.exists()){
      return true
    }
    else{
      return false
    }  
  }

  /**
   * Share pantry list
   * @param {String} pantryNm "Name of the pantry to be shared"
   * @param {String} mail "Email that the pantry list is shared with"
   */
  const updateUserShareGrocery = async(pantryNm, mail) => {
    // pantry and grocery are set up together
    const pantryName = pantryNm

    const pantryRef = doc(firestore,'Grocery',pantryName)

    const docSnap = await getDoc(pantryRef)
    if(!docSnap.exists()){
      alert("Grocery Error.")
    }
    else{
      // add pantry id to list of personal pantries for the current user
      const userRef = doc(firestore,'Users',mail)

      await updateDoc(userRef, {
        sg: arrayUnion(pantryName)
      })
    }
  }

  // NOTE : another way i thought of doing this prolly better: send the pantry name to new user where they decide whether to accept or reject.
  // if accept then that user adds it themselves. if they reject they don't.... this is just hacking it just to see how it works in testing phase
  const updateUserSharePantry = async(pantryNm, mail) => {
    // pantry and grocery are set up together
    const pantryName = pantryNm

    const pantryRef = doc(firestore,'Pantry',pantryName)

    const docSnap = await getDoc(pantryRef)
    if(!docSnap.exists()){
      alert("Pantry Error.")
    }
    else{
      // add pantry id to list of personal pantries for the current user
      const userRef = doc(firestore,'Users',mail)

      await updateDoc(userRef, {
        sp: arrayUnion(pantryName)
      })

      // add the matching grocery list
      updateUserShareGrocery(pantryNm, mail)
    }
  }

  // sharing pantry also automatically shares that grocery name
  const share = () => {
    if(pantryExist()) {
      const pantryName = sharePantry.toLowerCase() +"-"+ currUser.email
      if(userExist()){
        const mail = shareEmail.toLowerCase()
        updateUserSharePantry(pantryName, mail)
      }else{
        alert("No user with that mail found")
        return
      }
    }
    else{
      alert("This pantry doesn't exist.")
      return
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
  //   if(currUser){
  //     return true
  //   }
  //   else{
  //     return false
  //   }
  // }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("i think it runs")
      console.log(user)
      console.log(user.email)
      setUser(user)
    })
  }, [])

  useEffect(() => {
    // if(!isLoggedIn()){
    //   alert("Your user has been logged out please log in.")
    //   Cookies.remove('userEmail')
    //   router.push('/')
    // }
    updatePersonalPantry()
    updateSharedPantry()
  }, [currUser])

  return (
    <Box sx={{ flexGrow: 1 }}>
            {/* create pantry modal */}
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

      {/* share pantry modal */}
      <Modal
        open={shareOpen}
        onClose={handleShareClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Share Pantry
          </Typography>
          <Stack spacing={2} justifyContent={"space-between"}>
            <TextField id="outlined-basic" label={"Pantry name"}variant="outlined" value={sharePantry} onChange= {(e) => {setSharePantry(e.target.value)}}/>
            <TextField id="outlined-basic" label={"Email"}variant="outlined" value={shareEmail} onChange= {(e) => {setShareEmail(e.target.value)}}/>
            <Button variant="outlined" 
              onClick={() => {
              share()
              handleShareClose()
               }}>Share
              </Button>
          </Stack>
        </Box>
      </Modal>

      <Box>
        <Box display={"flex"} justifyContent={"space-between"} margin={"15px"}>
          <Typography variant="h4" >My Pantry and Grocery Lists</Typography>
          <Stack  direction={{ xs: 'column', md: 'row' }} 
                  spacing={2} // Space between buttons
                  alignItems="center">
            <Button variant="contained" onClick={handleOpen}>Create Pantry</Button>
            <Button variant="contained" onClick={handleShareOpen}>Share Pantry</Button>            
          </Stack>

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
                      <Item sx={hover} onClick={() =>{visitPantry(pantryNm)}}>{name}</Item>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Item sx={hover} onClick={() =>{ visitGrocery(pantryNm)}}>{name} Grocery</Item>
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
        {sharedPantry.length == 0 ? (
            <Grid item xs={12}>
              <Typography variant="h5" margin={"5px"} textAlign={"center"} color={"grey"}>You have no shared pantry/inventory at this time</Typography>
            </Grid>
            ) : (
              <Box width={"100%"} height={"35%"} overflow={"auto"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                {sharedPantry.map((pantryNm) => {
                  const name = pantryNm.split("-")[0]
                  return(
                    <Grid key={name} container rowspacing={1} marginBottom={"40px"}>
                      <Grid item md={6} xs={12} >
                        <Item sx={hover} onClick={() =>{visitPantry(pantryNm)}}>{name}</Item>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Item sx={hover} onClick={() =>{ visitGrocery(pantryNm)}}>{name} Grocery</Item>
                      </Grid>
                    </Grid>
                  )
                })
              }
              </Box>
            )
          }
      </Box>
    </Box>
  );
}
