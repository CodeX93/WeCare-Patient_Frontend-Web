import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const Appointment = ({ appointments }) => {
  console.log(appointments);
  return (
    <Paper sx={{ p: 2 }}>
      <h2>Upcoming Appointments</h2>
      <List>
        {appointments.map((appointment, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: appointment.color }}>
                <CalendarTodayIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`Dr. ${appointment.id.doctor}`} />
            <ListItemText
              primary={appointment.id.speciality}
              secondary={`${appointment.id.appointmentDate} at ${appointment.id.selectedSlot}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Appointment;
