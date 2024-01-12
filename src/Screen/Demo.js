import React, { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import LeftNavBar from "../Components/LeftNavBar";
import AppointmentDash from "../Components/AppointmentDash";
import VitalSigns from "../Components/VitalSigns";
import { Grid, Box, Container } from "@mui/material";
import Todays from "../Components/Todays";
import { getAuth } from "firebase/auth";
import axios from "axios";

export default function Demo() {
  const [appointment, setappointment] = useState([]);
  const { user } = useUser();
  const dummyTasks = [
    {
      medication: "Aspirin",
      dosage: "100mg",
      done: false,
    },
    {
      medication: "Penicillin",
      dosage: "250mg",
      done: true,
    },
    {
      medication: "Metformin",
      dosage: "500mg",
      done: false,
    },
    {
      medication: "Ibuprofen",
      dosage: "200mg",
      done: true,
    },
    {
      medication: "Lisinopril",
      dosage: "10mg",
      done: false,
    },
  ];

  // const dummyAppointments = [
  //   {
  //     type: "Dentist",
  //     date: "Nov 23, 2023",
  //     time: "9:00 AM",
  //     color: "lightblue",
  //   },
  //   {
  //     type: "Cardiologist",
  //     date: "Nov 25, 2023",
  //     time: "12:00 PM",
  //     color: "lightgreen",
  //   },
  //   {
  //     type: "Orthopedist",
  //     date: "Nov 30, 2023",
  //     time: "3:00 PM",
  //     color: "lightcoral",
  //   },
  //   {
  //     type: "Physician",
  //     date: "Dec 5, 2023",
  //     time: "4:00 PM",
  //     color: "lightgoldenrodyellow",
  //   },
  //   {
  //     type: "Endocrinologist",
  //     date: "Dec 10, 2023",
  //     time: "6:00 PM",
  //     color: "lightpink",
  //   },
  // ];

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
          setappointment(response.data);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Left Navigation Bar */}
      <LeftNavBar />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Vital Signs */}
          <Grid item xs={12} md={6} lg={3}>
            <VitalSigns generalHealth={75} waterBalance={83} />
          </Grid>

          {/* Today's Todo */}
          <Grid item xs={12} md={6} lg={3}>
            <Todays tasks={dummyTasks} />
          </Grid>

          {/* Appointments */}
          <Grid item xs={12} lg={6}>
            <AppointmentDash appointments={appointment} />
          </Grid>

          {/* If there are other components that need to be included in the layout,
              you can add more Grid items here */}
        </Grid>
      </Container>
    </Box>
  );
}
