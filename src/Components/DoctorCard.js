import React from "react";
import {
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function DoctorCard({ doctor }) {
  // Initialize the theme using the useTheme hook
  const theme = useTheme();

  // Use the theme in the useMediaQuery hook
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Provide default values for doctor in case it's not passed as a prop
  const doctorData = doctor || {
    name: "Unknown Doctor",
    specialty: "Unknown Specialty",
    // Add other default values as needed
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={2}
    >
      <Avatar
        src="/doctor-profile.jpg" // Replace with actual image path
        alt={doctorData.name}
        sx={{
          width: isMobile ? 100 : 150,
          height: isMobile ? 100 : 150,
          mb: 2,
        }}
      />
      <Typography variant="h5" component="h1" gutterBottom>
        {doctorData.name}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {doctorData.specialty}
      </Typography>
    </Box>
  );
}
