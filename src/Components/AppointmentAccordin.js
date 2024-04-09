import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AppointmentCard = ({ appointment, onSelect }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    onSelect(appointment);
    navigate("/specificappointment", {
      state: {
        appointment,
      },
    });
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {"Dr. " + appointment.doctorName}
        </Typography>
        <Typography variant="body1">
          {new Date(appointment.date)
            .toLocaleDateString("en-GB")
            .replace(/\//g, " - ")}
        </Typography>

        <Typography variant="body1">
          Speciality: {appointment.department}
        </Typography>
        <Typography variant="body1">
          Complain: {appointment.complain}
        </Typography>
        <Typography variant="body1">Fee: {appointment.fee}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{
            marginTop: 2,
            backgroundColor: "#307867",
            ":hover": {
              backgroundColor: "#5cac9e",
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
