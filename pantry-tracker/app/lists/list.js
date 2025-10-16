"use client"// client component
import { useRouter, useSearchParams } from "next/navigation";
import { AppBar,Toolbar,TextField,Box,Typography,
  Card,CardContent,IconButton,Fab,  } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";

import { doc, getDoc, updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore'
import { auth, firestore } from "../firebase";

import React, {useEffect, useState} from 'react';
import { capitalize } from "../utility/stringUtility"
import  AddItemDialog  from "./addItemDialog"

export default function List() {
    const router = useRouter()
    const searchParams = useSearchParams();
    //grocery/pantry list id
    const listId = searchParams.get("id");
    //grocery/pantry list name
    const listName = searchParams.get("name");
    //grocery/pantry list name
    const listType = searchParams.get("type");

    const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState(false)

    const visitHome = () =>{
        console.log("clicked")
        router.push("/Home")
    }

    const [listItems, setListItems] = useState([])

    const getListItems = async() => {
        const listRef = doc(firestore, 'lists', listId)
        const listDocSnapshot = await getDoc(listRef)
        if(!listDocSnapshot){
            //something went wrong-- list no longer exists/has been deleted.
            alert("Something went wrong. Please try again later")
            router.push("/")
        }
        const listItems = listDocSnapshot.data()['items']
        return listItems
    }

    /**
     * Add item to the list.
     * @param {String} item Name of new grocery item
     */
    const addItem = async(item) => {
        const listRef = doc(firestore, 'lists', listId)
        const listItems = await getListItems();
        const itemLower = item.toLowerCase()
        let exist = false
        listItems.forEach((item) => {
            if(itemLower == item){
                alert("This item already exist.")
                exist = true
            }
        })
        if(!exist){
            await updateDoc(listRef, {
                items: arrayUnion(itemLower)
            })
        }

        //should we also just manually add it here? and if
        // a user refreshes, they simply, get updates from backend...
        listItems.push(itemLower)
        setListItems(listItems)
    }

    /**
     * Look up an item in the grocery list.
     * @param {String} searchValue Value to be searched up
     */
    const searchItem = async(searchValue) => {
        const lowerCaseSearch = searchValue.toLowerCase();
        //is this a bad design decision ?
        const listItems = await getListItems()
        const matchSearch = []
        listItems.forEach((item) => {
            const name = item
            if(name.toLowerCase().startsWith(lowerCaseSearch)){
            matchSearch.push(item)
            }
        })
        setListItems(matchSearch)
    }
    //when page is loaded up
    useEffect(() => {
        const fetchData = async () => {
            try{
                const listItems = await getListItems();
                setListItems(listItems)
                console.log("running ")
            }catch(err){
                console.err(err);
            }
        }
        fetchData()
    },[])

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(180deg, #F5F5F5, #E0E0E0)", }}>
        {/* AppBar */}
        <AppBar position="static" sx={{ backgroundColor: "#2C3E50" }}>
            <Toolbar sx= {{ display:"flex", justifyContent: "center"}}>
            <Typography variant="h3" sx={{ p: 2 }}>
                ReStockd
            </Typography>
            </Toolbar>
        </AppBar>

        {/* Search Bar */}
        <Box
            sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
            backgroundColor: "#fff",
            boxShadow: 1,
            zIndex: 1,
            }}
        >
            <TextField
                id="outlined-basic"
                label="Search for an item..."
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => searchItem(e.target.value)}
                sx={{
                    maxWidth: 400,
                    backgroundColor: "#FDFDFD",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    },
                }}
            />
        </Box>        
        {/* Scrollable Cards */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {listItems.map((item) => (
            <Card
                //key=
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
                    {capitalize(item)}
                </Typography>
                </CardContent>

                <Box>
                <IconButton
                    sx={{ color: "#34495E" }}
                    onClick={() => console.log("Move to grocery cart")}
                >
                    <ShoppingCartIcon />
                </IconButton>
                <IconButton
                    sx={{ color: "#2C3E50" }}
                    onClick={() => console.log("Delete")}
                >
                    <DeleteOutlineIcon  />
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
            onClick={() => setAddItemDialogIsOpen(true)}
        >
            <AddIcon />
        </Fab>

        <AddItemDialog
            open = {addItemDialogIsOpen}
            onClose = {() => setAddItemDialogIsOpen(false)}
            onCreate = {(itemName) => addItem(itemName)}
        />
    </Box>
    );
}
