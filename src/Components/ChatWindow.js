import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import { getAuth } from "firebase/auth";
import "../Styles/chat.css";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  Button,
  List,
  ListItem,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios"; // Import Axios

const ChatWindow = ({ selectedUser }) => {
  const { user } = useUser();
  const auth = getAuth();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Function to send a message
  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    const newMessage = {
      senderId: getAuth().currentUser.uid, // Replace with your user ID logic
      receiverId: selectedUser.doctorData.uniqueIdentifier, // Replace with your user ID logic
      senderName: getAuth().currentUser.displayName,
      MessageContent: messageInput,
      receiverName:
        selectedUser.doctorData.firstName +
        " " +
        selectedUser.doctorData.lastName,
    };

    // Send the message to your backend API using Axios
    try {
      const response = await axios.post(
        "http://localhost:4005/chat/sendmessage",
        newMessage
      );

      if (response.status === 200) {
        setMessageInput(""); // Clear the input field
        // Add the new message to the state
        setMessages([...messages, newMessage]);
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Function to load messages
  const loadMessages = async () => {
    if (!selectedUser) return;
    const id = selectedUser.doctorData.uniqueIdentifier;
    console.log(id);
    try {
      const response = await axios.post("http://localhost:4005/chat/getchats", {
        receiverId: id,
      });

      if (response.status === 200) {
        setMessages(response.data || []); // Set messages directly
        console.log(messages);
      } else {
        console.error("Failed to retrieve messages");
      }
    } catch (error) {
      console.error("Error retrieving messages:", error);
    }
  };

  useEffect(() => {
    if (!selectedUser) {
      // Clear messages when no user is selected
      setMessages([]);
    } else {
      loadMessages();
    }
  }, [selectedUser]);

  return selectedUser ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "100vh",
      }}
    >
      <Typography variant="body1">{selectedUser.senderName}</Typography>
      <List sx={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.senderName === auth.currentUser.displayName
                ? "sent"
                : "received"
            }`}
          >
            <div className="message-content">
              <Typography variant="body1">{message.MessageContent}</Typography>
            </div>
            <div className="message-sender">{message.senderName}</div>
          </div>
        ))}
      </List>

      <Box
        component="form"
        sx={{
          display: "flex",
          p: 1,
          borderTop: "1px solid #ccc",
          backgroundColor: "white",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          sx={{ mr: 1 }}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button type="button" variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  ) : (
    <Typography variant="body1">
      <strong>Nothing to show:</strong> Please Select user
    </Typography>
  );
};

export default ChatWindow;
