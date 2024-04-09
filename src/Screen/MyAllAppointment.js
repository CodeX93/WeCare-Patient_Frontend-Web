import React, { useState, useEffect } from "react";
import LeftNavBar from "../Components/LeftNavBar";
import AppointmentCard from "../Components/AppointmentAccordin";
import SpecificAppointment from "../Screen/SpecificAppointment";
import {
  Container,
  Grid,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios"; // Import Axios
import { IP } from "../assets/ConstantValues";

export default function MyAppointment() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const Navigator = useNavigate();

  const [appointments, setAppointments] = useState([]); // State to store appointments
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    // Fetch appointments data from your API when the component mounts
    const fetchAppointments = async () => {
      const patid = getAuth().currentUser.uid;
      try {
        const response = await axios.post(
          `${IP}:3067/appointment/allpappointment`,
          { patientId: patid }
        );
        if (response.status === 200) {
          console.log(response.data.appointments);
          setAppointments(response.data.appointments);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchAppointments();
  }, []);

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const createNewAppointment = () => {
    Navigator("/createAppointment");
  };

  const layoutStyle = {
    display: "flex",
    marginTop: "20px",
  };

  const contentStyle = {
    flexGrow: 1,
    marginLeft: "10px",
    marginTop: "80px",
    width: "100%",
  };

  const headingStyle = {
    color: "#333",
    textAlign: "center",
    marginBottom: "24px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: "bold",
    fontSize: "2rem",
  };

  return (
    <Box style={layoutStyle}>
      <LeftNavBar />

      <Container style={contentStyle}>
        <h1 style={headingStyle}>My Appointments</h1>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="end"
          justifyContent="end"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={createNewAppointment}
            startIcon={<EditCalendarIcon />}
            sx={{
              mb: 2,
              backgroundColor: "#307867",
              fontWeight: "bolder",
              letterSpacing: "1.9",
              ":hover": {
                backgroundColor: "#5cac9e",
              },
            }} // added some margin-bottom for spacing
          >
            Create New Appointment
          </Button>
        </Box>
        {loading ? ( // Display loading indicator while fetching appointments
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", // Make the box take up the entire viewport height
            }}
          >
            <CircularProgress color="primary" size={80} />
          </Box>
        ) : appointments.length > 0 ? ( // Check if the appointments array has items
          <Grid item xs={12} md={6} lg={4}>
            {appointments.map((appointment) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={appointment.id}
                sx={{ width: "100%" }}
              >
                <AppointmentCard
                  appointment={appointment}
                  onSelect={handleSelectAppointment}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", // Make the box take up the entire viewport height
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "center", fontSize: "18px" }}
            >
              You currently have no Appointments
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
