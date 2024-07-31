"use client"// client component
import { Box, Stack,Typography,Button, Modal, TextField } from "@mui/material";
import { firestore } from "./firebase.js";
import {collection, doc, getDocs,query,setDoc, deleteDoc, getDoc} from 'firebase/firestore'
import React, {useEffect, useState} from 'react';
import reactDom from "react-dom";

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
export default function Home() {
  const [pantry, setPantry] = useState([])

  const [itemName, setItemName] = useState('')

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async() => {
    const snapshot = query(collection(firestore, 'Items'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({itemNm:doc.id,quantity: doc.data()["quantity"]})
    });
    console.log(pantryList)
    setPantry(pantryList)
  }

  const addItem = async(item) => {
    console.log(item)
    const docRef = doc(firestore, 'Items',item)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currQuantity = docSnap.data()["quantity"]
      await setDoc(docRef, {quantity:currQuantity+1}, {merge:true})
    } else {
      await setDoc(docRef, {quantity:1})
    }
    updatePantry();
    console.log(docRef)
  }

  const deleteItem = async(item) => {
    const docRef = doc(firestore, "Items", item)
    const docSnap = await getDoc(docRef);
    const currQuantity = docSnap.data()["quantity"]
    if(currQuantity == 1){
      await deleteDoc(docRef)
    }
    else{
      await setDoc(docRef, {quantity:currQuantity-1}, {merge:true})
    }
    updatePantry()  
  }
  useEffect(() => {

    updatePantry()
    // console.log(pantry)
  }, [])
  return (
    <Box
      height="100vh"
      width= "100vw"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      gap={1}
      
    >
      <Button variant="contained" onClick={handleOpen}>Add</Button>
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
            <TextField id="outlined-basic" label="Enter item" variant="outlined" value={itemName} onChange= {(e) => setItemName(e.target.value)}/>
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
      <Box
        sx={{ border: '2px solid black' }}>
        <Box width="600px" height="70px">
          <Typography variant="h2" bgcolor={"#ADD8E6"} textAlign={"center"}>Pantry items</Typography>
        </Box>
        <Stack width="600px" height="200px" spacing={2} overflow={'auto'}>
          {pantry.map(({itemNm, quantity},i) => (
            <Box 
              key={i}
              width="100%"
              height="200px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              padding={5}>
                <Typography variant="h3" textAlign={"center"} style={{ flex: '0 0 33%', textAlign: 'center' }}>{itemNm.charAt(0).toUpperCase() + itemNm.slice(1)}</Typography> 
                <Typography variant="h3">{quantity}</Typography>
                <Button variant="contained" onClick={() => deleteItem(itemNm)}>Remove</Button>
            </Box>)
          )}
        </Stack>
      </Box>    
    </Box>
  );
}
