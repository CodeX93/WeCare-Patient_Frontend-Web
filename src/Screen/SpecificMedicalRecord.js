import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Grid,
  Icon,
} from "@mui/material";
import LeftNavBar from "../Components/LeftNavBar";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

function MedicalRecordDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state.record;

  const editRecord = () => {
    // Logic to navigate to the edit medical record page goes here
  };

  const layoutStyle = {
    display: "flex",
    marginTop: "20px",
  };

  const contentStyle = {
    flexGrow: 1,
    marginLeft: "10px",
    marginTop: "80px",
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
        <Box style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="h5" component="div" style={headingStyle}>
            Medical Record Details
          </Typography>
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            Record Type: {record.recordType}
          </Typography>
          <Typography variant="body1">
            Record Title: {record.recordTitle}
          </Typography>
          <Typography variant="body1">
            Visible to Doctor:{" "}
            {record.isVisibleToDoctor ? (
              <Icon color="success">
                <CheckCircleOutline />
              </Icon>
            ) : (
              <Icon color="error">
                <CancelOutlined />
              </Icon>
            )}
          </Typography>
          <Typography variant="body1">Date: {record.date}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={editRecord}
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: "#307867",
              fontWeight: "bolder",
              letterSpacing: "1.9",
              ":hover": {
                backgroundColor: "#5cac9e",
              },
            }}
          >
            Change Visibility
          </Button>
        </Box>

        <Box style={{ marginTop: "40px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                Comments: {record.comments}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {record.fileUrl && (
          <Box style={{ marginTop: "40px" }}>
            <Typography
              variant="h6"
              style={{ marginBottom: "10px", fontWeight: "bold" }}
            >
              Report
            </Typography>
            <Box>
              {/* Conditionally render an image or PDF viewer based on file type */}
              {record.fileUrl.endsWith(".pdf") ? (
                // Display PDF viewer component
                <iframe
                  title="Report PDF"
                  src={record.fileUrl}
                  width="100%"
                  height="600"
                ></iframe>
              ) : (
                // Display image component
                <img
                  src={record.fileUrl}
                  alt="Report"
                  style={{ width: "100%", pointerEvents: "none" }}
                />
              )}
            </Box>
          </Box>
        )}

        {record.medicines && (
          <Box style={{ marginTop: "40px" }}>
            <Typography
              variant="h6"
              style={{ marginBottom: "10px", fontWeight: "bold" }}
            >
              Medicines
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Medicine Name
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Dosage</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Duration
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Complaint
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record.medicines.map((medicine, index) => (
                    <TableRow key={index}>
                      <TableCell>{medicine.medicineName}</TableCell>
                      <TableCell>{medicine.dosage}</TableCell>
                      <TableCell>{medicine.duration}</TableCell>
                      <TableCell>{medicine.complaint}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default MedicalRecordDetails;
