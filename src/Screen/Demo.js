import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import LeftNavBar from "../Components/LeftNavBar";
import { Box, Container, Grid } from "@mui/material";
import VitalSigns from "../Components/VitalSigns";
import Todays from "../Components/Todays";
import AppointmentDash from "../Components/AppointmentDash";
import axios from "axios";
import { IP } from "../assets/ConstantValues";
import { getAuth } from "firebase/auth";

export default function Demo() {
  const [appointments, setAppointments] = useState([]); // State to store appointments
  const { user } = useUser();
  const dummyTasks = [
    { medication: "Aspirin", dosage: "100mg", done: false },
    { medication: "Penicillin", dosage: "250mg", done: true },
    { medication: "Metformin", dosage: "500mg", done: false },
    { medication: "Ibuprofen", dosage: "200mg", done: true },
    { medication: "Lisinopril", dosage: "10mg", done: false },
  ];
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
          setAppointments(response.data.appointments);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        // setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchAppointments();
  }, []);
  useEffect(() => {
    console.log(appointments);
  }, [appointments]);
  return (
    <Box sx={{ display: "flex", mt: 5 }}>
      {/* Adjusted margin-top here */}
      <LeftNavBar />
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6} mt={8}>
            <VitalSigns generalHealth={75} waterBalance={83} spo2={98} />
          </Grid>
          <Grid item xs={12} md={6} lg={6} mt={8}>
            <AppointmentDash appointments={appointments} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Todays tasks={dummyTasks} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
