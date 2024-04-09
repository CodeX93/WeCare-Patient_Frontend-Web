import React, { useEffect, useState } from "react";
import LeftNavbar from "../Components/LeftNavBar";
import { IP } from "../assets/ConstantValues";
import {
  Box,
  Container,
  Typography,
  Avatar,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation

function SpecificAppointment() {
  const Navigator = useNavigate();
  const [profilePic, setProfilePic] = useState(null); // Initialize profilePic state
  const [MeetingLink, setLink] = useState("");
  const [appointment, setAppointment] = useState(null); // Initialize appointment state
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Use useLocation hook to access the appointment data from state
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.appointment) {
      setAppointment(location.state.appointment);
    }
  }, [location.state]);
  console.log(appointment);
  useEffect(() => {
    // Fetch doctor data when the appointment changes
    const fetchDoctorData = async (doctorId) => {
      try {
        const response = await axios.get(
          `${IP}:5006/api/user/getdoc/${doctorId}`
        );

        // Set the profilePic state with the fetched profilePic
        if (response.data && response.data.profilePic) {
          setProfilePic(response.data.profilePic);
        } else {
          console.log("Profile pic not found in response data");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    if (appointment) {
      console.log(appointment);
      console.log(appointment.doctorId);
      if (appointment.type === "Online") {
        setLink(appointment.meetingLink);
      }
      fetchDoctorData(appointment.doctorId);
      console.log(MeetingLink);
    }
  }, [appointment]); // Fetch doctor data when appointment changes

  const layoutStyle = {
    display: "flex",
    marginTop: "20px",
  };

  const contentStyle = {
    flexGrow: 1,
    marginLeft: "10px",
    marginTop: "80px",
  };

  return (
    <Box style={layoutStyle}>
      <LeftNavbar />

      <Container style={contentStyle}>
        {profilePic ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={2}
          >
            <Avatar
              src={profilePic} // Set Avatar src with profilePic
              alt={`${appointment.doctorName}`}
              sx={{
                width: isMobile ? 100 : 150,
                height: isMobile ? 100 : 150,
                mb: 2,
              }}
            />
            <Typography variant="h5" component="h1" gutterBottom>
              {"Dr. " + appointment.doctorName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {appointment.department}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h5" component="h1" gutterBottom>
            {profilePic}
          </Typography>
        )}

        {appointment && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start" // Align items to the left
            p={2}
          >
            <TextField
              label="Description"
              multiline
              rows={4}
              defaultValue={appointment.complain}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              fullWidth
              margin="normal"
            />

            <Typography variant="h6" component="h2" gutterBottom>
              Appointment On
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ marginLeft: "8px" }}
            >
              <strong>
                <Typography variant="body1">
                  {new Date(appointment.date)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, " - ")}
                </Typography>
              </strong>
            </Typography>
            <Typography variant="body1" gutterBottom></Typography>
            {/* <Typography variant="h6" component="h2" gutterBottom>
            Appointment Mode:{" "}
          </Typography> */}
            {/* {appointment.mode === "online" && ( */}
            <Box mt={2}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#307867" }}
                onClick={() =>
                  Navigator(`/call`, { state: { meetingLink: MeetingLink } })
                }
                startIcon={<CallIcon />}
                sx={{ mb: 2 }}
              >
                Attend Appointment
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default SpecificAppointment;
