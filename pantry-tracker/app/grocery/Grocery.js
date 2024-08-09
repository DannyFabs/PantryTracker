"use client"// client component
import { Box, Stack,Typography,Button, Modal, TextField,Tooltip, tooltipClasses, styled } from "@mui/material";
import { Help } from "@mui/icons-material";
import { auth, firestore } from "../firebase.js";
import { Home } from "@mui/icons-material";
import { doc, getDoc, updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore'
import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";


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

export default function Grocery() {
  const router = useRouter()

  const visitHome = () =>{
    console.log("clicked")
    router.push("/Home")
  }


  const [grocery, setGrocery] = useState([])

  const [itemName, setItemName] = useState('')

  const [currUser, setUser] = useState(null)


  // const groceryListName = Cookies.get('currentGrocery')+ "-" +  user.email
  const groceryListName = Cookies.get('currentPantry')


  // editing an item name.
  const [oldName, setOldName] = useState('')
  const [newName, setNewName] = useState('')

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const getCurrGrocery = async() => {
    // const snapshot = query(collection(firestore, 'Grocery'))
    // const docs = await getDocs(snapshot)
    // const pantryList = [] 
    // docs.forEach((doc) => {
    //   pantryList.push(doc.id)
    // });
    // return pantryList

    const groceryRef = doc(firestore, 'Grocery', groceryListName)
    const groceryDocSnapshot = await getDoc(groceryRef)
    const groceryItems = groceryDocSnapshot.data()['items']

    return groceryItems
  }

  const updateGrocery = async() => {
    const groceryItems = await getCurrGrocery();
    setGrocery(groceryItems)
  }

  const addItem = async(item) => {
    // const itemLower = item.toLowerCase()
    // const docRef = doc(firestore, "Grocery",itemLower)
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //     alert("Item with this name already exist")
    // } else {
    //   await setDoc(docRef, {})
    // }
    // updateGrocery();

    const groceryRef = doc(firestore, 'Grocery', groceryListName)
    const groceryDocSnapshot = await getDoc(groceryRef)
    const groceryItems = groceryDocSnapshot.data()['items']

    const itemLower = item.toLowerCase()
    let exist = false
    groceryItems.forEach((item) => {
      if(itemLower == item){
        alert("This item already exist.")
        exist = true
      }
    })
    if(!exist){
      await updateDoc(groceryRef, {
        items: arrayUnion(itemLower)
      })
    }
    updateGrocery();
  }

  const deleteItem = async(item) => {
    // const docRef = doc(firestore, "Grocery",itemLower)
    // const docSnap = await getDoc(docRef);
    // await deleteDoc(docRef)

    const groceryRef = doc(firestore, 'Grocery', groceryListName)
    const itemLower = item.toLowerCase()

    await updateDoc(groceryRef, {
      items: arrayRemove(itemLower)
    })

    updateGrocery()  
  }

  const searchItem = async(searchValue) => {
      const lowerCaseSearch = searchValue.toLowerCase();
      const groceryItems = await getCurrGrocery()
      const matchSearch = []
      groceryItems.forEach((item) => {
        const name = item
        if(name.toLowerCase().startsWith(lowerCaseSearch)){
          matchSearch.push(item)
        }
      })
      setGrocery(matchSearch)
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

  const handlePurchase = async(item) => {
    const itemLower = item.toLowerCase()
    // in the pantry collection
    // NOTE: grocerlist name is the same as the pantry list name
    const pantryDocRef = doc(firestore, 'Pantry',groceryListName)

    const pantryDocSnapshot = await getDoc(pantryDocRef)
    const pantryItems = pantryDocSnapshot.data()['items']

    let exist = false
    pantryItems.forEach((item) => {
      if(itemLower == item){
        alert("This item already exist.")
        exist = true
      }
    })
    if(!exist){
      await updateDoc(pantryDocRef, {
        items: arrayUnion(itemLower)
      })
    }

    // const docRef = doc(firestore, 'Items',itemLower)
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   alert('Item already exists in grocery list.')
    // } else {
    //   await setDoc(docRef, {})
    // }
    deleteItem(item)
  }

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
    updateGrocery()
  }, [currUser])

  return (
    <Box
      height="100vh"
      width= "100%"
      display={"flex"}
      gap={1}
      
    >
    {/*Add item modal */}
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
          <Box width="100%" bgcolor={"#ADD8E6"} style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000 // Ensure it stays above other content
          }}>
            <Stack width="100%" direction={"row"} spacing={2} alignItems="center" justify-content="space-between"  bgcolor={"#ADD8E6"}>
              <Home fontSize="large" onClick={visitHome} />
              <Typography variant="h2" bgcolor={"#ADD8E6"} textAlign={"center"} marginY={"5px"} flexGrow={1}>My Grocery List</Typography>
            </Stack>
          
          <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={{xs:2, md:10}} // Space
          alignItems="center"
          justifyContent={"center"}
          margin={1}
          >      
            <TextField id="outlined-basic" label="Search" variant="outlined" onChange={(e) => {searchItem(e.target.value)}}/>
            <Button variant="contained" onClick={handleOpen}>Add item</Button>
          </Stack>
        </Box>


        <Stack width="100%" height="auto" spacing={2} overflow={'auto'} marginTop={{ xs:35, md: 20}}>
          {grocery.map(itemNm =>{
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
                  <BootstrapTooltip title={"Item finished and no plan of buying more for now"}><Button color="error" variant="contained" onClick={() => deleteItem(itemNm)}>Remove</Button></BootstrapTooltip>
                  <BootstrapTooltip title={"Item purchased and should be added back to pantry."}><Button color="success" variant="contained" onClick={() => handlePurchase(itemNm)}>Purchased</Button></BootstrapTooltip>

                </Stack>
            </Box>)}
          )}
        </Stack>
      </Box>    
    </Box>
  );
}

