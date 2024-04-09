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
  // Sort appointments by combined date and time
  const sortedAppointments = appointments.sort((a, b) => {
    // Combine date and time into a single value
    const dateTimeA = new Date(`${a.date}T${a.slot}`);
    const dateTimeB = new Date(`${b.date}T${b.slot}`);
    return dateTimeA - dateTimeB;
  });

  // Filter the first 5 appointments
  const firstFiveAppointments = sortedAppointments.slice(0, 5);

  return (
    <Paper sx={{ p: 2 }}>
      <h2>Upcoming Appointments</h2>
      <List>
        {firstFiveAppointments.map((appointment) => (
          <ListItem key={appointment.slotId}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "#307867" }}>
                <CalendarTodayIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`Dr. ${appointment.doctorName}`} />
            <ListItemText
              primary={appointment.department}
              secondary={`${new Date(appointment.date)
                .toLocaleDateString("en-GB")
                .replace(/\//g, " - ")} at ${appointment.slot}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Appointment;
