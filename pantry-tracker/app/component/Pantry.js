"use client"// client component
import { Box, Stack,Typography,Button, Modal, TextField,Tooltip, tooltipClasses, styled } from "@mui/material";
import { Home } from "@mui/icons-material";
import { firestore,auth } from "../firebase.js";
import {collection, doc, getDocs,query,setDoc, deleteDoc, getDoc, updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore'
import React, {useEffect, useState} from 'react';
import reactDom from "react-dom";
import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { cookies } from "next/headers.js";
import Cookies from "js-cookie";

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

export default function Pantry() {

  const router = useRouter()

  const visitHome = () =>{
    console.log("clicked")
    router.push("/Home")
  }

  const [pantry, setPantry] = useState([])

  const [itemName, setItemName] = useState('')

  const user = auth.currentUser
  // const pantryName = Cookies.get('currentPantry')+ "-" +  user.email
  const pantryName = Cookies.get('currentPantry')


  // editing an item name.
  const [oldName, setOldName] = useState('')
  const [newName, setNewName] = useState('')

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const getCurrPantry = async() => {
    // const snapshot = query(collection(firestore, 'af@gmail.com/PersonalPantries/KitchenPantry'))
    // const docs = await getDocs(snapshot)
    const pantryRef = doc(firestore, 'Pantry', pantryName)
    const pantryDocSnapshot = await getDoc(pantryRef)
    const pantryItems = pantryDocSnapshot.data()['items']
    // const pantryList = [] 
    // docs.forEach((doc) => {
    //   pantryList.push(doc.id)
    // });
    // console.log(pantryList)
    return pantryItems
  }

  const updatePantry = async() => {
    const pantryItems = await getCurrPantry();
    console.log(pantryItems)
    setPantry(pantryItems)
  }

  const addItem = async(item) => {
    console.log(item)
    const pantryRef = doc(firestore, 'Pantry', pantryName)
    const pantryDocSnapshot = await getDoc(pantryRef)
    const pantryItems = pantryDocSnapshot.data()['items']

    const itemLower = item.toLowerCase()
    let exist = false
    pantryItems.forEach((item) => {
      if(itemLower == item){
        alert("This item already exist.")
        exist = true
      }
    })
    if(!exist){
      await updateDoc(pantryRef, {
        items: arrayUnion(itemLower)
      })
    }

    // if (docSnap.exists()) {
    //   alert("This item already exist.")
    // } else {
    //   await setDoc(docRef, {})
    // }
    updatePantry();
  }

  const deleteItem = async(item) => {

    const pantryRef = doc(firestore, 'Pantry', pantryName)
    const itemLower = item.toLowerCase();


    // const docRef = doc(firestore, "Items", itemLower)
    // const docSnap = await getDoc(docRef);
    // await deleteDoc(docRef)
    await updateDoc(pantryRef, {
      items: arrayRemove(itemLower)
    })

    updatePantry()  
  }

  const searchItem = async(searchValue) => {
      const lowerCaseSearch = searchValue.toLowerCase();
      const pantryItems = await getCurrPantry()
      const matchSearch = []
      pantryItems.forEach((item) => {
        const name = item;
        if(name.toLowerCase().startsWith(lowerCaseSearch)){
          matchSearch.push(item)
        }
      })
      setPantry(matchSearch)
  }

  const restockItem = async(item) => {
    const itemLower = item.toLowerCase()

    // in the grocery collection
    // NOTE: grocerlist name is the same as the pantry list name
    const groceryDocRef = doc(firestore, 'Grocery',pantryName)

    const groceryDocSnapshot = await getDoc(groceryDocRef)
    const groceryItems = groceryDocSnapshot.data()['items']

    let exist = false
    groceryItems.forEach((item) => {
      if(itemLower == item){
        alert("This item already exist.")
        exist = true
      }
    })
    if(!exist){
      await updateDoc(groceryDocRef, {
        items: arrayUnion(itemLower)
      })
    }
    deleteItem(item)
  }

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  const editItem = async(oldName, newName) => {
    deleteItem(oldName)
    addItem(newName)
  }

  const isLoggedIn = () => {
      const user = auth.currentUser
      if(user){
        return true
      }
      else{
        return false
      }
  }

  useEffect(() => {
    if(!isLoggedIn()){
      alert("Your user has been logged out please log in.")
      Cookies.remove('userEmail')
      router.push('/')
    }
    updatePantry()
  }, [])

  return (
    <Box
      height="100vh"
      width= "100%"
      display={"flex"}
      gap={1}
      
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Items
          </Typography>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
            <TextField id="outlined-basic" label="Enter item" variant="outlined" value={itemName} onChange= {(e) => {setItemName(e.target.value)}}/>
            <Button variant="outlined" 
              onClick={() => {
              addItem(itemName);
              handleClose();
              setItemName('');
               }}>Add
              </Button>
          </Box>
        </Box>
      </Modal>
      
      {/* edit modal */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Item
          </Typography>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
            <TextField id="outlined-basic" variant="outlined" value={newName} onChange= {(e) => {setNewName(e.target.value)}}/>
            <Button variant="outlined" 
              onClick={() => {
              editItem(oldName, newName);
              handleEditClose()
               }}>Edit
              </Button>
          </Box>
        </Box>
      </Modal>
      <Box
        width= "100%">
        <Stack width="100%" direction={"row"} spacing={2} alignItems="center" justify-content="space-between"  bgcolor={"#ADD8E6"}>
          <Home fontSize="large" onClick={visitHome} />
          <Typography variant="h2" bgcolor={"#ADD8E6"} textAlign={"center"} marginY={"5px"} flexGrow={1}>My Pantry Items</Typography>
        </Stack>
        
        <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={{xs:2, md:10}} // Space
        alignItems="center"
        justifyContent={"center"}
        margin={2}
        >      
          <TextField id="outlined-basic" label="Search" variant="outlined" onChange={(e) => {searchItem(e.target.value)}}/>
          <Button variant="contained" onClick={handleOpen}>Add item</Button>
        </Stack>
        <Stack width="100%" height="100vh" spacing={2} overflow={'auto'}>
          {pantry.map(itemNm =>{
            const name = itemNm.charAt(0).toUpperCase() + itemNm.slice(1);
            return (<Box 
              key={itemNm}
              width="100%"
              height="auto"
              display={"flex"}
              justifyContent={"space-evenly"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              padding={5}>
                <Typography variant="h4" textAlign={"center"} style={{ flex: '0 0 50%', textAlign: 'center' }}>{name}</Typography> 
                {/* setting new name aswell, because the textfield in the modal is a controlled component and value has to be used */}
                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  spacing={2} // Space between buttons
                  alignItems="center"
                >
                  <BootstrapTooltip title={"Change item name"}><Button  variant="contained" onClick={() => {handleEditOpen(); setOldName(name); setNewName(name)}}>Edit</Button></BootstrapTooltip>
                  <BootstrapTooltip title={"Add item to grocery list"}><Button  color="warning" variant="contained" onClick={() => restockItem(itemNm)}>Restock</Button></BootstrapTooltip>
                  <BootstrapTooltip title={"Item finished and no plan of buying more for now"}><Button color="error" variant="contained" onClick={() => deleteItem(itemNm)}>Remove</Button></BootstrapTooltip>
                </Stack>
            </Box>)}
          )}
        </Stack>
      </Box>    
    </Box>
  );
}

