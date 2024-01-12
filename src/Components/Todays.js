import React from "react";
import { Paper, List, ListItem, ListItemText, Checkbox } from "@mui/material";

const Todays = ({ tasks }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <h2>ToDos</h2>
      <List>
        {tasks.map((task, index) => (
          <ListItem
            // key={index}
            secondaryAction={<Checkbox edge="end" checked={task.done} />}
          >
            <ListItemText
              primary={task.medication}
              secondary={`Take ${task.dosage}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Todays;
