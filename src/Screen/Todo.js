import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  Container,
  Divider,
  Button,
  Box,
} from "@mui/material";
import LeftNavBar from "../Components/LeftNavBar";

// Helper function to create a Date object with a specific date and time
const createDateTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
};

// Mock data for the list of medications
const initialTodos = [
  {
    id: 1,
    name: "Amlodipine",
    dosage: "5mg",
    dateTime: createDateTime("2023-11-27", "08:00"),
    taken: false,
    category: "morning",
  },
  {
    id: 2,
    name: "Paracetamol",
    dosage: "500mg",
    dateTime: createDateTime("2023-11-27", "13:00"),
    taken: false,
    category: "noon",
  },
  {
    id: 3,
    name: "Ibuprofen",
    dosage: "200mg",
    dateTime: createDateTime("2023-11-27", "18:00"),
    taken: false,
    category: "night",
  },
  // ... other medications
];

const MedicationTodo = ({ todo, onChange }) => (
  <ListItem>
    <Checkbox
      edge="start"
      checked={todo.checked}
      onChange={() => onChange(todo.id)}
    />
    <ListItemText
      primary={todo.name}
      secondary={`Dosage: ${
        todo.dosage
      }, DateTime: ${todo.dateTime.toLocaleString()}`}
    />
  </ListItem>
);

const MedicationTodoList = () => {
  const [todos, setTodos] = useState([]);
  const [missed, setMissed] = useState([]);

  useEffect(() => {
    // Initialize todos with an additional 'checked' property
    const initializedTodos = initialTodos.map((todo) => ({
      ...todo,
      checked: todo.taken,
    }));
    setTodos(initializedTodos);
  }, []);

  useEffect(() => {
    const now = new Date();
    const missedMedicines = todos.filter(
      (todo) => !todo.taken && todo.dateTime < now
    );
    setMissed(missedMedicines);
  }, [todos]);

  const handleCheckboxChange = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, checked: !todo.checked };
        }
        return todo;
      })
    );
  };

  const handleUpdate = () => {
    setTodos(
      todos.map((todo) => ({
        ...todo,
        taken: todo.checked,
        timestamp: todo.checked ? new Date().toISOString() : todo.timestamp,
      }))
    );
  };

  const layoutStyle = {
    display: "flex",
    marginTop: "40px",
  };

  const contentStyle = {
    flexGrow: 1,
    marginLeft: "10px",
    marginTop: "80px",
  };

  const headingStyle = {
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: "bold",
    fontSize: "2rem",
  };

  return (
    <Box style={layoutStyle}>
      <LeftNavBar />
      <Container style={contentStyle}>
        <Typography variant="h4">Today's Medication Schedule</Typography>

        {["morning", "noon", "night"].map((category) => (
          <div key={category}>
            <Typography variant="h6" my={2}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Typography>
            <List>
              {todos
                .filter((todo) => todo.category === category)
                .map((todo) => (
                  <MedicationTodo
                    key={todo.id}
                    todo={todo}
                    onChange={handleCheckboxChange}
                  />
                ))}
            </List>
          </div>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          sx={{ my: 4, backgroundColor: "#307867" }}
        >
          Update Todo
        </Button>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h4">Missed Medications</Typography>
        <List>
          {missed.map((todo) => (
            <ListItem key={todo.id}>
              <ListItemText
                primary={todo.name}
                secondary={`Dosage: ${
                  todo.dosage
                }, DateTime: ${todo.dateTime.toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default MedicationTodoList;
