"use client"
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Chip from "@mui/material/Chip";

export default function PantryDialog({ open, onClose, onCreate, type }) {
  const [pantryName, setPantryName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Invalid email");
      return;
    }
    if (emails.includes(email)) {
      alert("Email already added");
      return;
    }
    if (emails.length >= 4) {
      alert("Maximum of 4 people allowed");
      return;
    }
    setEmails([...emails, email]);
    setEmailInput("");
  };

  const handleDeleteEmail = (emailToDelete) => {
    setEmails(emails.filter((e) => e !== emailToDelete));
  };

  const handleCreate = async() => {
    if (!pantryName) {
      alert("Please enter a pantry name");
      return;
    }
    const payload =
      type === "personal"
        ? { pantryName }
        : { pantryName, emails };
    await onCreate(payload);
    // Reset dialog
    setPantryName("");
    setEmailInput("");
    setEmails([]);
    onClose();
  };

  const handleClose = () => {
    setPantryName("");
    setEmailInput("");
    setEmails([]);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" sx={{ color: "#34495E" }}>
          {type === "personal" ? "New Personal Pantry" : "New Shared Pantry"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Pantry Name"
          fullWidth
          variant="outlined"
          value={pantryName}
          onChange={(e) => setPantryName(e.target.value)}
        />

        {type === "shared" && (
          <Box mt={2}>
            <Typography variant="subtitle1" sx={{ color: "#7F8C8D", mb: 1 }}>
              Invite Roommates with emails (max 4)
            </Typography>

            <Box display="flex" gap={1} alignItems="center">
              <TextField
                label="Enter email"
                variant="outlined"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                fullWidth
              />
              <IconButton color="primary" onClick={handleAddEmail}>
                <AddIcon />
              </IconButton>
            </Box>

            <Stack direction="row" mt={1} flexWrap="wrap" alignItems="left">
              {emails.map((email) => (
                <Chip
                  key={email}
                  label={email}
                  onDelete={() => handleDeleteEmail(email)}
                  sx={{ mb: 1 , mr: 1 }}
                />
              ))}
            </Stack>
          </Box>
        )}
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
