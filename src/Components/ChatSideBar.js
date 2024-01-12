import React, { useState, useEffect } from "react";
import { List, ListItem, Avatar, ListItemText } from "@mui/material";
import axios from "axios"; // Import Axios

const ChatSideBar = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersFromAPI = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6874/api/user/getAll"
        );
        const userData = response.data;
        setUsers(userData);
        console.log(userData);
        console.log(users);
      } catch (error) {
        console.error("Error fetching users from the API:", error);
      }
    };

    fetchUsersFromAPI();
  }, []); // Fetch users once on component mount

  return (
    <List>
      {users.map((user, index) => (
        <ListItem
          button
          key={index}
          onClick={() => {
            onUserSelect(user);
          }}
        >
          <Avatar
            alt={user.doctorData.firstName}
            src={user.doctorData.profilePic}
          />
          <ListItemText
            primary={`${user.doctorData.firstName} ${user.doctorData.lastName}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ChatSideBar;
