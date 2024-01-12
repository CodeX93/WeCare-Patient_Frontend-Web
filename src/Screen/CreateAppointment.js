import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import LeftNavBar from "../Components/LeftNavBar";

function CreateAppointment() {
  const location = useLocation();
  const navigator = useNavigate();
  const [speciality, setSpeciality] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctorsBySpeciality, setDoctorsBySpeciality] = useState({});
  const [doctorsDetails, setDoctorsDetails] = useState({});
  const [appointmentDate, setAppointmentDate] = useState("");
  const [complain, setComplain] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [fee, setFee] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDoctorUniqueId, setSelectedDoctorUniqueId] = useState("");
  const [doctorUniqueID, setDoctorUniqueId] = useState("");
  const [userUid, setUserUid] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6874/api/user/getAll"
        );
        const doctors = response.data;
        const tempDoctorsBySpeciality = {};
        const tempDoctorsDetails = {};

        doctors.forEach((doctor) => {
          const category = doctor.doctorData.category;
          const name = `${doctor.doctorData.firstName} ${doctor.doctorData.lastName}`;
          const uuid = doctor.doctorData.uniqueIdentifier;

          if (!tempDoctorsBySpeciality[category]) {
            tempDoctorsBySpeciality[category] = [];
          }
          tempDoctorsBySpeciality[category].push(name);

          tempDoctorsDetails[name] = uuid;
        });

        setDoctorsBySpeciality(tempDoctorsBySpeciality);
        setDoctorsDetails(tempDoctorsDetails);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (location.state && location.state.doctor) {
      const doctorInfo = location.state.doctor.doctorData;
      const doctorName = `${doctorInfo.firstName} ${doctorInfo.lastName}`;
      const doctorUid = location.state.doctor.doctorData;
      setSpeciality(doctorInfo.category);
      setDoctor(doctorName);
      setDoctorUniqueId(doctorInfo.uniqueIdentifier);

      // Set a dummy fee or fetch the actual fee
    }
  }, [location]);

  useEffect(() => {
    if (appointmentDate && doctor) {
      const doctorUniqueIdentifier = doctorsDetails[doctor];
      if (doctorUniqueIdentifier) {
        fetchTimeSlots(doctorUniqueIdentifier, appointmentDate);
      }
    }
  }, [appointmentDate, doctor, doctorsDetails]);

  const handleSpecialityChange = (event) => {
    setSpeciality(event.target.value);
    setDoctor("");
    setTimeSlots([]); // Clear time slots when specialty changes
  };

  const handleDoctorChange = (event) => {
    const selectedDoctorName = event.target.value;
    setDoctor(selectedDoctorName);
    const uniqueId = doctorsDetails[selectedDoctorName];
    setSelectedDoctorUniqueId(uniqueId); // Set the unique identifier for the selected doctor
    setTimeSlots([]); // Clear time slots when doctor changes
  };

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
    setFee("$100");
    setUserUid(getAuth().currentUser.uid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(userUid);
    // Prevent default form submission
    // console.log("Appointment Details:", {
    //   speciality,
    //   doctor,
    //   appointmentDate,
    //   selectedSlot,
    //   complain,
    //   fee,
    //   doctorUniqueID,
    //   userUid,
    // });
    navigator("/payment", {
      state: {
        appointmentDetails: {
          speciality,
          doctor,
          appointmentDate,
          selectedSlot,
          complain,
          fee,
          doctorUniqueID, // Include doctorUniqueID in appointmentDetails
          userUid,
        },
      },
    });
    // Add your form submission logic here
  };
  const fetchTimeSlots = async (doctorUniqueIdentifier, selectedDate) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/slots/getDoctorSlots/${doctorUniqueIdentifier}`,
        { params: { date: selectedDate } }
      );

      let slotTimes = [];

      // Assuming response.data is an array of objects as shown in your provided data
      response.data.forEach((dataItem) => {
        // Iterate over each availabilitySlots item
        dataItem.availabilitySlots.forEach((availabilitySlot) => {
          // Check if the date of the availabilitySlot matches the selectedDate
          if (availabilitySlot.date === selectedDate) {
            // Extract slots from detailedSlots
            availabilitySlot.detailedSlots.forEach((slot) => {
              // Create Date objects from the startTime and endTime strings
              const startTimeDate = new Date(slot.startTime);
              const endTimeDate = new Date(slot.endTime);

              // Get the time portion of the Date objects
              const startTime = startTimeDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const endTime = endTimeDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              slotTimes.push({
                startTime,
                endTime,
              });
            });
          }
        });
      });

      setTimeSlots(slotTimes);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]); // Reset the time slots in case of error
    }
  };

  return (
    <Box style={{ display: "flex", marginTop: "20px" }}>
      <LeftNavBar />
      <Container style={{ flexGrow: 1, marginLeft: "10px" }}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          Create New Appointment
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel>Speciality</InputLabel>
            <Select
              value={speciality}
              label="Speciality"
              onChange={handleSpecialityChange}
            >
              {Object.keys(doctorsBySpeciality).map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Doctor</InputLabel>
            <Select value={doctor} label="Doctor" onChange={handleDoctorChange}>
              {doctorsBySpeciality[speciality]?.map((doc) => (
                <MenuItem key={doc} value={doc}>
                  {doc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Appointment Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Available Slots</InputLabel>
            <Select
              value={selectedSlot}
              label="Available Slots"
              onChange={handleSlotChange}
            >
              {timeSlots.length > 0 ? (
                timeSlots.map((slot, index) => (
                  <MenuItem
                    key={index}
                    value={`${slot.startTime} - ${slot.endTime}`}
                  >
                    {`${slot.startTime} - ${slot.endTime}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No slots available</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField
            label="Complain"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={complain}
            onChange={(e) => setComplain(e.target.value)}
          />

          <Typography variant="h6" gutterBottom>
            Fee: {fee}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Proceed to Pay Fee
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default CreateAppointment;
