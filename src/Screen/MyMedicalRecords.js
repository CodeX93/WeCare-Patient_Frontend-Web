import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftNavBar from "../Components/LeftNavBar";
import CircularProgress from "@mui/material/CircularProgress";
import { IP } from "../assets/ConstantValues";
import { Box, Container, Paper, Typography, Grid, Button } from "@mui/material"; // Import Button component
import MedicalRecordCard from "../Components/MedicalRecordCard";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function MyMedicalRecords() {
  const Navigator = useNavigate();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const patientId = getAuth().currentUser.uid;
        const response = await axios.post(
          `${IP}:4001/medicalrecord/medical-record/`,
          {
            patientId: patientId,
          }
        );

        console.log(response.data.medicalRecords);
        setMedicalRecords(response.data.medicalRecords);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setIsFetching(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  const handleAddRecord = () => {
    Navigator("/add-medical-record");
  };

  return (
    <Box style={{ display: "flex", marginTop: "20px" }}>
      <LeftNavBar />
      <Container style={{ flexGrow: 1, marginLeft: "10px", marginTop: "80px" }}>
        <Paper
          style={{
            padding: "20px",
            margin: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            style={{
              marginBottom: "20px",
              fontWeight: "bold",
              letterSpacing: "1.3",
            }}
          >
            Uploaded Medical Records
          </Typography>
          {/* Add button for adding new medical record */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRecord}
            sx={{ backgroundColor: "#307867" }}
          >
            Add New Medical Record
          </Button>
        </Paper>
        {isFetching ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {medicalRecords.map((record) => (
              <Grid item xs={12} key={record.id}>
                <MedicalRecordCard record={record} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default MyMedicalRecords;
