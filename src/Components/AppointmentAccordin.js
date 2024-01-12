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
          {"Dr. " + appointment.doctor}
        </Typography>
        <Typography variant="body1">{appointment.appointmentDate}</Typography>
        <Typography variant="body1">
          Speciality: {appointment.speciality}
        </Typography>
        <Typography variant="body1">
          Complain: {appointment.complain}
        </Typography>
        <Typography variant="body1">Fee: {appointment.fee}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{ marginTop: 2 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
