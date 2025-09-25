"use client"// client component
import { AppBar,Toolbar,Tabs,Tab,Box,Typography,
  Card,CardContent,IconButton,Fab} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress"

import PantryDialog from "./CreatePantryDialog"

import { styled } from '@mui/material/styles';
import React, {useEffect, useState} from 'react';
import { useRouter } from "next/navigation";
import reactDom from "react-dom";
import Cookies from "js-cookie";

import { auth, firestore } from "../firebase";
import { doc, getDoc,setDoc, updateDoc, arrayUnion, addDoc, collection} from 'firebase/firestore'
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "../context/userContext"

// const Item = styled(Paper)(({ theme }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//     ...theme.typography.h4,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.primary,
//     height: "150px",
//     margin: "20px",
//     border: '1px solid #ccc',
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center"
//   }));
  
// const hover = {
//     ":hover":{
//         cursor:"pointer"
//     }
// }
// const gridItemStyle = {
//     backgroundColor: '#f0f0f0',
//     textAlign: 'center',
//     border: '1px solid #ccc',
//   };

export default function HomePage(){

  // user state variable
  const [currUser, setUser] = useState(null)

  // pantry state variables
  const [personalPantry, setPersonalPantry] = useState([])
  const [sharedPantry, setSharedPantry] = useState([])

  // modal state variables
  // const [open, setOpen] = React.useState(false);
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

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     console.log("i think it runs")
  //     console.log(user)
  //     console.log(user.email)
  //     setUser(user)
  //   })
  // }, [])

  // useEffect(() => {
  //   // if(!isLoggedIn()){
  //   //   alert("Your user has been logged out please log in.")
  //   //   Cookies.remove('userEmail')
  //   //   router.push('/')
  //   // }
  //   updatePersonalPantry()
  //   updateSharedPantry()
  // }, [currUser])


  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  }

  const {user, profile, loading } = useUser();

  const [loadingPods, setLoadingPods] = useState(true)

  const [personalPods, setPersonalPods] = useState([])
  const [sharedPods, setSharedPods] = useState([])

  //dialogue box
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState("")

  const splitPodsIntoPersonalAndShared = (pods) => {
    const personalPods = pods.filter(pod => pod.type === "personal")
    const sharedPods = pods.filter(pod => pod.type === "shared")
    setPersonalPods(personalPods)
    setSharedPods(sharedPods)
  }

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleAddClick = () => {
    if(tabIndex == 0){
      // personal pods
      setDialogType("personal")
      setOpenDialog(true)
    }else{
      setDialogType("shared")
      setOpenDialog(true)
    }
  }

  const personalPodNameExist = (podName) => {
    personalPods.forEach(personalPod => {
      if(personalPod.name.toLowerCase() == podName){
        return true;
      }
    });

    return false;
  }

  const validateSharedPodNameDoesNotExist = () => {

  }
    /**
   * Add a new pantry list to all pantry lists
   */
  const createNewPantry = async(payload) => {

    if(Object.keys(payload).length == 1){
      //personal pantry...
      const podName = payload.pantryName.toLowerCase()
      if(personalPodNameExist(podName))
        alert(`You already have a personal pantry named '${payload.pantryName}'`);

      const groceryListDocRef = await addDoc(collection(firestore, 'lists'), {
        items: []
      })

      const pantryListDocRef = await addDoc(collection(firestore, 'lists'), {
        items: []
      })

      const podDocRef = await addDoc(collection(firestore,'pods'), {
        name: podName,
        owner: profile.uid,
        type: "personal",
        groupId: null,
        groceryListId: groceryListDocRef.id,
        pantryListId:pantryListDocRef.id
      })

      const userRef = doc(firestore, "Usersv2", profile.uid);
      await updateDoc(userRef, {
        pods: arrayUnion(podDocRef.id)
      })

    }else{
      // shared pantry: pantry name and shared users
      console.log("Hello world")
    }

  }

  useEffect(() => {
    if(!loading && !user){
      router.push("/")// no user back to login page
    }
  }, [user, loading, router])

  useEffect(() => {
    if(!loading && profile?.pods?.length > 0){
      // when we get the profile get the pod ids
      // setPods(profile.pods);
      const loadPods = async () => {
        try {
          // Get all pods in a users list of pods
          const podPromises = profile.pods.map((id) =>
            getDoc(doc(firestore, "pods", id))
          );
          
          const podSnaps = await Promise.all(podPromises);
          console.log(podSnaps)
          const podData = podSnaps
            .filter((snap) => snap.exists())
            .map((snap) => ({
              id: snap.id,
              ...snap.data(),
            }));
          // new function
          splitPodsIntoPersonalAndShared(podData)
          // setPods(podData);
        } catch (err) {
          console.error("Error loading pods:", err);
        } finally {
          setLoadingPods(false);
        }
      };
      loadPods();
    }
    else{
      setLoadingPods(false);
    }
  }, [profile, loading])

  if (loadingPods) {
    return(
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
    )
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #F5F5F5, #E0E0E0)" }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#2C3E50" }}>
        <Toolbar sx= {{ display:"flex", justifyContent: "center"}}>
          <Typography variant="h3" sx={{ p: 2 }}>
            ReStockd
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          backgroundColor: "#F5F5F5",
          "& .MuiTab-root": { color: "#7F8C8D" },
          "& .Mui-selected": { color: "#34495E", fontWeight: 600 },
        }}
      >
        <Tab label="Personal" />
        <Tab label="Shared" />
      </Tabs>

      {/* Scrollable Cards */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {(tabIndex == 0 ? personalPods : sharedPods).map((pod) => (
          <Card
            key={pod.id}
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              backgroundColor: "#FFFFFF",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#2C3E50" }}>
                {capitalize(pod.name)}
              </Typography>
            </CardContent>

            <Box>
              <IconButton
                sx={{ color: "#2C3E50" }}
                onClick={() => console.log("Open Inventory", list.id)}
              >
                <Inventory2Icon />
              </IconButton>
              <IconButton
                sx={{ color: "#34495E" }}
                onClick={() => console.log("Open Grocery", list.id)}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#2C3E50",
          "&:hover": { backgroundColor: "#1A252F" },
        }}
        onClick={() => handleAddClick()}
      >
        <AddIcon />
      </Fab>
      
      <PantryDialog
        open = {openDialog}
        onClose = {() => setOpenDialog(false)}
        onCreate = {(payload) => createNewPantry(payload)}
        type = {dialogType}
      />
    </Box>
  );
  // return (
  //   <Box sx={{ flexGrow: 1 }}>
  //           {/* create pantry modal */}
  //     <Modal
  //       open={open}
  //       onClose={handleClose}
  //       aria-labelledby="modal-modal-title"
  //       aria-describedby="modal-modal-description"
  //     >
  //       <Box sx={style}>
  //         <Typography id="modal-modal-title" variant="h6" component="h2">
  //           New Pantry
  //         </Typography>
  //         <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
  //           <TextField id="outlined-basic" label={"Pantry name"}variant="outlined" value={newName} onChange= {(e) => {setNewName(e.target.value)}}/>
  //           <Button variant="outlined" 
  //             onClick={() => {
  //             addPantry()
  //             handleClose()
  //              }}>Create
  //             </Button>
  //         </Box>
  //       </Box>
  //     </Modal>

  //     {/* share pantry modal */}
  //     <Modal
  //       open={shareOpen}
  //       onClose={handleShareClose}
  //       aria-labelledby="modal-modal-title"
  //       aria-describedby="modal-modal-description"
  //     >
  //       <Box sx={style}>
  //         <Typography id="modal-modal-title" variant="h6" component="h2">
  //           Share Pantry
  //         </Typography>
  //         <Stack spacing={2} justifyContent={"space-between"}>
  //           <TextField id="outlined-basic" label={"Pantry name"}variant="outlined" value={sharePantry} onChange= {(e) => {setSharePantry(e.target.value)}}/>
  //           <TextField id="outlined-basic" label={"Email"}variant="outlined" value={shareEmail} onChange= {(e) => {setShareEmail(e.target.value)}}/>
  //           <Button variant="outlined" 
  //             onClick={() => {
  //             share()
  //             handleShareClose()
  //              }}>Share
  //             </Button>
  //         </Stack>
  //       </Box>
  //     </Modal>

  //     <Box>
  //       <Box display={"flex"} justifyContent={"space-between"} margin={"15px"}>
  //         <Typography variant="h4" >My Pantry and Grocery Lists</Typography>
  //         <Stack  direction={{ xs: 'column', md: 'row' }} 
  //                 spacing={2} // Space between buttons
  //                 alignItems="center">
  //           <Button variant="contained" onClick={handleOpen}>Create Pantry</Button>
  //           <Button variant="contained" onClick={handleShareOpen}>Share Pantry</Button>            
  //         </Stack>

  //       </Box>
  //         {personalPantry.length == 0 ? (
  //             <Grid item xs={12}>
  //               <Typography variant="h5" margin={"5px"} textAlign={"center"} color={"grey"}>You have no pantry/inventory at this time</Typography>
  //             </Grid>
  //         ) : (
  //           <Box width={"100%"} height={"35%"} overflow={"auto"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
  //             {personalPantry.map((pantryNm) => {
  //               const name = pantryNm.split("-")[0]

  //               return(
  //                 <Grid key={name} container rowspacing={1} marginBottom={"40px"}>
  //                   <Grid item md={6} xs={12} >
  //                     <Item sx={hover} onClick={() =>{visitPantry(pantryNm)}}>{name}</Item>
  //                   </Grid>
  //                   <Grid item md={6} xs={12}>
  //                     <Item sx={hover} onClick={() =>{ visitGrocery(pantryNm)}}>{name} Grocery</Item>
  //                   </Grid>
  //                 </Grid>
  //               )
  //             })
  //           }
  //           </Box>
  //         )
  //       }
  //     </Box>
  //     <Box>
  //       <Typography variant="h4" margin={"5px"} textAlign={"center"}>Shared With Me</Typography>
  //       {sharedPantry.length == 0 ? (
  //           <Grid item xs={12}>
  //             <Typography variant="h5" margin={"5px"} textAlign={"center"} color={"grey"}>You have no shared pantry/inventory at this time</Typography>
  //           </Grid>
  //           ) : (
  //             <Box width={"100%"} height={"35%"} overflow={"auto"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
  //               {sharedPantry.map((pantryNm) => {
  //                 const name = pantryNm.split("-")[0]
  //                 return(
  //                   <Grid key={name} container rowspacing={1} marginBottom={"40px"}>
  //                     <Grid item md={6} xs={12} >
  //                       <Item sx={hover} onClick={() =>{visitPantry(pantryNm)}}>{name}</Item>
  //                     </Grid>
  //                     <Grid item md={6} xs={12}>
  //                       <Item sx={hover} onClick={() =>{ visitGrocery(pantryNm)}}>{name} Grocery</Item>
  //                     </Grid>
  //                   </Grid>
  //                 )
  //               })
  //             }
  //             </Box>
  //           )
  //         }
  //     </Box>
  //   </Box>
  // );
}
