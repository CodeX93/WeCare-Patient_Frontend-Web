import React from "react";
import { Paper, Typography, CircularProgress, Box } from "@mui/material";

const VitalSigns = ({ generalHealth, waterBalance, spo2 }) => {
  return (
    <Box display="flex" gap={2}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">General Health</Typography>
        <CircularProgress
          variant="determinate"
          value={generalHealth}
          size={60}
        />
        <Typography variant="caption">{generalHealth}%</Typography>
      </Paper>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Water Balance</Typography>
        <CircularProgress
          variant="determinate"
          value={waterBalance}
          size={60}
        />
        <Typography variant="caption">{waterBalance}%</Typography>
      </Paper>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">SPO2</Typography>
        <CircularProgress variant="determinate" value={spo2} size={60} />
        <Typography variant="caption">{spo2}%</Typography>
      </Paper>
    </Box>
  );
};

export default VitalSigns;
