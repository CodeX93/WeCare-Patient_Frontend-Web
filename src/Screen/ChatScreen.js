// ChatScreen.js
import React, { useState } from "react";
import ChatWindow from "../Components/ChatWindow";
import LeftNavBar from "../Components/LeftNavBar";
import ChatSideBar from "../Components/ChatSideBar";
import { Box } from "@mui/material";

const ChatScreen = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Pass the handleUserSelect to ChatSideBar
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        flexDirection: "row",
      }}
    >
      <LeftNavBar />
      <ChatSideBar onUserSelect={handleUserSelect} />
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {/* Pass selectedUser to ChatWindow to filter messages */}
        <ChatWindow selectedUser={selectedUser} />
      </Box>
    </Box>
  );
};

export default ChatScreen;
