"use client"
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export default function AddItemDialog({ open, onClose, onCreate }) {
    
    const [itemName, setItemName] = useState("");

    const handleCreate = async() => {
        if (!itemName) {
            alert("Please enter an item name");
            return;
        }
        await onCreate(itemName);
        // Reset dialog
        handleClose()
    };

    const handleClose = () => {
        setItemName("");
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
            <Typography variant="h6" sx={{ color: "#34495E" }}>
            {"New Item"}
            </Typography>
        </DialogTitle>

        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            />
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose} sx={{ color: "#7F8C8D" }}>
            Cancel
            </Button>
            <Button
            onClick={handleCreate}
            variant="contained"
            sx={{ backgroundColor: "#34495E", color: "#fff" }}
            >
            Add
            </Button>
        </DialogActions>
        </Dialog>
    );
}
