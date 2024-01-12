import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import axios from "axios";
import LeftNavBar from "../Components/LeftNavBar";
import { useNavigate } from "react-router-dom";

function PatientUpload() {
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);

  const specialties = [
    "",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "surgeon",
    // Add more specialties here
  ];

  useEffect(() => {
    // Function to fetch doctors using Axios
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6874/api/user/getAll"
        );
        setDoctors(response.data);
        console.log(response.data); // Update the state with the fetched doctors
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchDoctors(); // Execute the function to fetch doctors
    console.log(doctors);
  }, []);

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  // Filter doctors based on selected specialty
  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doctor) => doctor.category === selectedSpecialty)
    : doctors;

  const handleClick = (doctor) => {
    navigate("/specificdoctor", { state: { doctor } }); // Navigate with doctor data
  };

  return (
    <Box style={{ display: "flex", marginTop: "20px" }}>
      <LeftNavBar />
      <Container style={{ flexGrow: 1, marginLeft: "10px" }}>
        <Paper style={{ padding: "20px", margin: "20px" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="20px"
          >
            <Typography
              variant="h5"
              style={{ marginTop: "20px", marginBottom: "10px" }}
            >
              Doctor Specialties
            </Typography>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="specialty-select-label">Specialty</InputLabel>
              <Select
                labelId="specialty-select-label"
                id="specialty-select"
                value={selectedSpecialty}
                onChange={handleSpecialtyChange}
                label="Specialty"
              >
                {specialties.map((specialty, index) => (
                  <MenuItem key={index} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Grid container spacing={2}>
            {filteredDoctors.map((doctor, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={doctor.doctorData.uniqueIdentifier}
              >
                <Card
                  onClick={() => handleClick(doctor)}
                  style={{ cursor: "pointer" }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={doctor.doctorData.profilePic}
                    alt={doctor.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {doctor.doctorData.firstName +
                        " " +
                        doctor.doctorData.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Specialty: {doctor.doctorData.category}
                    </Typography>
                    {/* Add more doctor details here */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default PatientUpload;
