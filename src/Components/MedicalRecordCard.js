import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MedicalRecordCard = ({ record }) => {
  const navigate = useNavigate();
  const handleOpen = () => {
    navigate("/get-medical", {
      state: {
        record,
      },
    });
  };
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Record Type: {record.recordType}
        </Typography>
        <Typography variant="body1">Title: {record.recordTitle}</Typography>
        <Typography variant="body1">Date: {record.date}</Typography>
        <Typography variant="body1">
          Visible to Doctor: {record.isVisibleToDoctor ? "Yes" : "No"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ backgroundColor: "#307867" }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordCard;
