import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Folder as FolderIcon,
  Chat as ChatIcon,
  LocalHospital as LocalHospitalIcon,
  Receipt as ReceiptIcon,
  Forum as ForumIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { getAuth, signOut } from "firebase/auth";
import logo from "../assets/WeCare - Logo .png";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function LeftNavbar() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useUser();
  const auth = getAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path) => {
    return () => {
      navigate(path);
      if (path === "/") {
        signOut(auth)
          .then(() => {
            console.log("log out success");
          })
          .catch((error) => {
            console.log("Log out failed");
          });
      }
      if (isMobile) setDrawerOpen(false);
    };
  };

  const menuItems = [
    { path: "/home", icon: <DashboardIcon />, text: "Dashboard" },
    { path: "/todo", icon: <AssignmentIcon />, text: "Todo" },
    { path: "/appointment", icon: <EventIcon />, text: "Appointment" },
    { path: "/doctors", icon: <LocalHospitalIcon />, text: "Doctors" },
    { path: "/chats", icon: <ChatIcon />, text: "Chats" },
    { path: "/medical-record", icon: <FolderIcon />, text: "Medical Records" },
    { path: "/bill", icon: <ReceiptIcon />, text: "Bills" },
    { path: "/forum", icon: <ForumIcon />, text: "Forum" },
    { path: "/profile", icon: <PersonIcon />, text: "Profile" },
  ];

  return (
    <div>
      <AppBar
        position="fixed"
        className={classes.appBar}
        sx={{ height: 60, backgroundColor: "#307867" }}
      >
        <Toolbar>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <img
              src={logo}
              alt="Logo"
              className={classes.logo}
              style={{
                width: "auto",
                height: "200%",
              }}
            />
          )}
          <Typography
            variant="h5"
            noWrap
            style={{ fontWeight: "bolder", letterSpacing: 1.8 }}
          >
            WeCare
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Box
          sx={{
            mt: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        ></Box>
        <Divider />
        <List>
          <ListItem button onClick={handleNavigation("/profile")}>
            <ListItemAvatar>
              <Avatar src={user.profileImageUrl || ""}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              style={{ fontSize: "22", fontWeight: "bolder" }}
              primary={user ? user.username : "Guest"}
            />
          </ListItem>
          <Divider />
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={handleNavigation(item.path)}
              selected={window.location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <Divider />
          <ListItem button onClick={handleNavigation("/")}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {/* Your main content goes here */}
      </main>
    </div>
  );
}

export default LeftNavbar;
