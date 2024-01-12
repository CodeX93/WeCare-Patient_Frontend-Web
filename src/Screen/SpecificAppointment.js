import React from "react";
import LeftNavbar from "../Components/LeftNavBar";
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
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useLocation } from "react-router-dom"; // Import useLocation

function SpecificAppointment() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Use useLocation hook to access the appointment data from state
  const location = useLocation();
  const appointment = location.state && location.state.appointment;
  const layoutStyle = {
    display: "flex",
    marginTop: "20px",
  };

  const contentStyle = {
    flexGrow: 1,
    marginLeft: "10px",
  };

  return (
    <Box style={layoutStyle}>
      <LeftNavbar />

      <Container style={contentStyle}>
        {appointment ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={2}
          >
            <Avatar
              src="/doctor-profile.jpg" // Replace with actual image path
              alt={appointment.doctor}
              sx={{
                width: isMobile ? 100 : 150,
                height: isMobile ? 100 : 150,
                mb: 2,
              }}
            />
            <Typography variant="h5" component="h1" gutterBottom>
              {"Dr. " + appointment.doctor}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {appointment.speciality}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h5" component="h1" gutterBottom>
            No appointment data available.
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
              Purpose
            </Typography>
            <Typography variant="body1" gutterBottom>
              {appointment.complain}
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
              Appointment On
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ marginLeft: "8px" }}
            >
              <strong>
                {appointment.appointmentDate}&nbsp;&nbsp;&nbsp;
                {appointment.selectedSlot}
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
                color="primary"
                startIcon={<CallIcon />}
                sx={{ mr: 1 }}
              >
                Audio Call
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<VideoCallIcon />}
              >
                Video Call
              </Button>
            </Box>
            ){/* } */}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default SpecificAppointment;
