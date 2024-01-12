import React, { useState, useEffect } from "react";
import LeftNavBar from "../Components/LeftNavBar";
import AppointmentCard from "../Components/AppointmentAccordin";
import SpecificAppointment from "../Screen/SpecificAppointment";
import { Container, Grid, Box, Button, Typography } from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios"; // Import Axios

export default function MyAppointment() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const Navigator = useNavigate();
  const [appointments, setAppointments] = useState([]); // State to store appointments

  useEffect(() => {
    // Fetch appointments data from your API when the component mounts
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4003/appointment/patient/${
            getAuth().currentUser.uid
          }`
        );

        if (response.status === 200) {
          setAppointments(response.data);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
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
  };

  const headingStyle = {
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
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
            sx={{ mb: 2 }} // added some margin-bottom for spacing
          >
            Create New Appointment
          </Button>
        </Box>
        {selectedAppointment ? (
          <SpecificAppointment appointment={selectedAppointment} />
        ) : appointments.length > 0 ? ( // Check if the appointments array has items
          <Grid container spacing={2}>
            {appointments.map((appointment, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <AppointmentCard
                  appointment={appointment.id}
                  onSelect={handleSelectAppointment}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
            No Appointments
          </Typography>
        )}
      </Container>
    </Box>
  );
}
