import React, { useState } from "react";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Divider,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import FolderIcon from "@mui/icons-material/Folder";
import ChatIcon from "@mui/icons-material/Chat";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ForumIcon from "@mui/icons-material/Forum";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { getAuth, signOut } from "firebase/auth";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "240px",
    [theme.breakpoints.down("sm")]: {
      width: "56px", // Smaller width for small screens
    },
  },
  avatar: {
    backgroundColor: "#757ce8",
  },
  drawerContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  drawerList: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  selectedIcon: {
    color: theme.palette.primary.main, // Color for the selected icon
  },
  marginRight: {
    margin: "2%",
  },
}));

function LeftNavbar() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [selectedItem, setSelectedItem] = useState("");
  const { user } = useUser();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigator = useNavigate();
  const handleNavigation = (path, item) => {
    return () => {
      navigator(path);
      if (path === "/") {
        signOut(auth)
          .then(() => {
            console.log("log out success");
          })
          .catch((error) => {
            console.log("Log out failed");
          });
      }
      setSelectedItem(item);
      if (isMobile) setDrawerOpen(false); // Close drawer after navigation on mobile
    };
  };

  // Function to determine if an item is selected
  const isSelected = (item) => selectedItem === item;
  const auth = getAuth();

  return (
    <Box className={classes.marginRight}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <List className={classes.drawerContainer}>
          {/* Profile with Avatar */}
          <ListItem button onClick={handleNavigation("/profile", "profile")}>
            <ListItemAvatar>
              {user.profileImageUrl ? (
                <Avatar src={user.profileImageUrl} className={classes.avatar} />
              ) : (
                <PersonIcon />
              )}
            </ListItemAvatar>
            {drawerOpen && (
              <ListItemText primary={user ? user.username : "Guest"} />
            )}
          </ListItem>
          <Divider />
          <Box className={classes.drawerList}>
            {/* Dashboard */}
            <ListItem button onClick={handleNavigation("/home", "home")}>
              <ListItemIcon>
                <DashboardIcon
                  className={isSelected("home") ? classes.selectedIcon : ""}
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Dashboard" />}
            </ListItem>
            {/* ToDo */}
            <ListItem button onClick={handleNavigation("/todo", "todo")}>
              <ListItemIcon>
                <AssignmentIcon
                  className={isSelected("todo") ? classes.selectedIcon : ""}
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Todo" />}
            </ListItem>
            {/* Appointment */}
            <ListItem
              button
              onClick={handleNavigation("/appointment", "appointment")}
            >
              <ListItemIcon>
                <EventIcon
                  className={
                    isSelected("appointment") ? classes.selectedIcon : ""
                  }
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Appointment" />}
            </ListItem>
            {/* Doctors */}
            <ListItem button onClick={handleNavigation("/doctors", "doctors")}>
              <ListItemIcon>
                <LocalHospitalIcon
                  className={isSelected("doctors") ? classes.selectedIcon : ""}
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Doctors" />}
            </ListItem>
            {/* Chats */}
            <ListItem button onClick={handleNavigation("/chats", "chats")}>
              <ListItemIcon>
                <ChatIcon
                  className={isSelected("chats") ? classes.selectedIcon : ""}
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Chats" />}
            </ListItem>
            {/* Medical Records */}
            <ListItem
              button
              onClick={handleNavigation("/medical-record", "medical-record")}
            >
              <ListItemIcon>
                <FolderIcon
                  className={
                    isSelected("medical-record") ? classes.selectedIcon : ""
                  }
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Medical Records" />}
            </ListItem>
            {/* Bills */}
            <ListItem button onClick={handleNavigation("/bill", "bill")}>
              <ListItemIcon>
                <ReceiptIcon
                  className={isSelected("bill") ? classes.selectedIcon : ""}
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Bills" />}
            </ListItem>
            {/* Forum */}
            <ListItem button onClick={handleNavigation("/forum", "forum")}>
              <ListItemIcon>
                <ForumIcon
                  className={isSelected("forum") ? classes.selectedIcon : ""}
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Forum" />}
            </ListItem>
            {/* Profile */}
            <ListItem button onClick={handleNavigation("/profile", "profile")}>
              <ListItemIcon>
                <PersonIcon
                  className={isSelected("profile") ? classes.selectedIcon : ""}
                />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Profile" />}
            </ListItem>
          </Box>
          <Divider />
          {/* Sign Out */}
          <ListItem button onClick={handleNavigation("/", "sign-out")}>
            <ListItemIcon>
              <ExitToAppIcon
                className={isSelected("sign-out") ? classes.selectedIcon : ""}
              />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Sign Out" />}
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

export default LeftNavbar;
