import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { Routes, Route } from "react-router-dom";
import Login from "./Screen/Login";
import SignUp from "./Screen/Signup";
import Demo from "./Screen/Demo";
import Todo from "./Screen/Todo";
import UploadMedicalRecord from "./Screen/UploadMedicalRecord";
import Profile from "./Screen/Profile";
import MyAllAppointment from "./Screen/MyAllAppointment";
import CreateAppointment from "./Screen/CreateAppointment";
import AllDoctor from "./Screen/AllDoctor";
import SpecificDoctor from "./Screen/SpecificDoctor";
import Newsfeed from "./Screen/Newsfeed";
import ChatScreen from "./Screen/ChatScreen";
import SpecificAppointment from "./Screen/SpecificAppointment";
import Payment from "./Screen/Payment";
// import { useUser } from "./Context/UserContext";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#556cd6", // Primary color for your app
      },
      secondary: {
        main: "#19857b", // Secondary color
      },
      error: {
        main: "#ff1744", // Color for error states
      },
      background: {
        default: "#fff", // Background color
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Default font family
      fontSize: 14, // Default font size
      // You can add more typography settings here
    },
    // You can also customize other theme aspects like spacing, breakpoints, etc.
  });

  // const { setUser } = useUser();

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Demo />} />
        <Route path="/createAppointment" element={<CreateAppointment />} />
        <Route path="/appointment" element={<MyAllAppointment />} />
        <Route path="/doctors" element={<AllDoctor />} />
        <Route path="/specificdoctor" element={<SpecificDoctor />} />
        <Route path="/specificappointment" element={<SpecificAppointment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forum" element={<Newsfeed />} />
        <Route path="/medical-record" element={<UploadMedicalRecord />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/chats" element={<ChatScreen />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
