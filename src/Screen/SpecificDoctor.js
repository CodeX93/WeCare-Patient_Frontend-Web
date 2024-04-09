import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import LeftNavBar from "../Components/LeftNavBar";

function DoctorDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state.doctor;

  const createNewAppointment = () => {
    navigate("/createAppointment", { state: { doctor } }); // Corrected the navigate usage
  };
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
      <LeftNavBar />
      <Container style={contentStyle}>
        <Box style={{ marginTop: "20px", textAlign: "center" }}>
          <Avatar
            src={doctor.doctorData.profilePic}
            alt={doctor.name}
            style={{ width: 128, height: 128, margin: "0 auto" }}
          />
          <Typography
            variant="h5"
            component="div"
            style={{ marginTop: "10px" }}
          >
            {doctor.doctorData.firstName + " " + doctor.doctorData.lastName}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            style={{ marginBottom: "20px" }}
          >
            Specialty: {doctor.doctorData.category}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => createNewAppointment(doctor.doctorData)}
          >
            Make Appointment
          </Button>
        </Box>

        <Box style={{ marginTop: "40px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                {doctor.doctorData.doctorAbout}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default DoctorDetails;
