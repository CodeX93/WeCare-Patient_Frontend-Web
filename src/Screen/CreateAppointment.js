import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { HospitalName, IP } from "../assets/ConstantValues";
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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import axios from "axios";
import LeftNavBar from "../Components/LeftNavBar";
import { useUser } from "../Context/UserContext";
import DoctorDetails from "./SpecificDoctor";

function CreateAppointment() {
  const location = useLocation();
  const navigator = useNavigate();
  const [department, setSpeciality] = useState("");
  const [doctorName, setDoctor] = useState("");
  const [type, setAppointmentType] = useState("");
  const [specialityList, setSpecialityList] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [hospital, setHospitalName] = useState("");
  const [email, setPatientEmail] = useState("");
  const [profileImage, setPatientProfileImage] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setAppointmentDate] = useState(new Date());
  const [complain, setComplain] = useState("");
  const [doctorId, setDoctorUniqueId] = useState("");
  const [meetingLink, setLink] = useState("");
  const [slot, setSelectedSlot] = useState("");
  const [fee, setFee] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [slotId, setSlotId] = useState("");
  // const [doctorId, setDoctorId] = useState("");

  const [patientId, setPatientId] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await axios.get(`${IP}:4010/api/Department/`);

        const specialties = response.data.map((department) => department.name);
        setSpecialityList(specialties);
      } catch (error) {
        console.error("Error fetching specialities:", error);
      }
    };

    fetchSpecialities();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${IP}:5006/api/user/getAll`);
        const doctors = response.data.filter(
          (doctor) => doctor.doctorData.category === department
        );
        setDoctorList(doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    if (department) {
      fetchDoctors();
    }
  }, [department]);

  // Other useEffect hooks remain the same

  const handleSpecialityChange = (event) => {
    const selectedSpeciality = event.target.value;

    setSpeciality(selectedSpeciality);

    // setPatientEmail(user.email);
    // setPatientProfileImage(user.profileImageUrl);
    // setPatientName(user.username);
    setSelectedDoctor("");
    setTimeSlots([]);
  };

  const handleDoctorChange = (event) => {
    const selectedDoctor = event.target.value;
    setSelectedDoctor(selectedDoctor);

    // Check if the selectedDoctor matches the doctor's full name in the doctorList
    const doctor = doctorList.find(
      (doc) =>
        `${doc.doctorData.firstName} ${doc.doctorData.lastName}` ===
        selectedDoctor
    );

    // If a doctor is found with the selected name, update the doctorUniqueId and doctorId states
    if (doctor) {
      setDoctorUniqueId(doctor.doctorData.uniqueIdentifier);
      // setDoctorId(doctor.doctorData.uniqueIdentifier);
      // Also, set the doctorName state
      setDoctor(selectedDoctor); // Add this line to set the doctorName state
    }

    setTimeSlots([]); // Reset timeSlots state
  };

  useEffect(() => {}, [hospital]);

  useEffect(() => {
    setPatientName(user.username);
    setPatientEmail(getAuth().currentUser.email);
    setPatientProfileImage(user.profileImageUrl);
    setPatientId(getAuth().currentUser.uid);
  }, [user]);

  useEffect(() => {
    if (location.state && location.state.doctor) {
      const doctorInfo = location.state.doctor.doctorData;

      const doctorName = `${doctorInfo.firstName} ${doctorInfo.lastName}`;
      // const doctorUid = location.state.doctor.doctorData;
      setSpeciality(doctorInfo.category);
      setDoctor(doctorName);
      setDoctorUniqueId(doctorInfo.uniqueIdentifier);

      // Set a dummy fee or fetch the actual fee
    }
  }, [location]);

  const handleSlotChange = (event) => {
    const selectedSlot = event.target.value;
    const selectedSlotObject = timeSlots.find(
      (slot) => `${slot.startTime} - ${slot.endTime}` === selectedSlot
    );
    if (selectedSlotObject) {
      setSelectedSlot(selectedSlot);

      setSlotId(selectedSlotObject.slotid);
      console.log(selectedSlot.hospital);
    }
  };

  const handleAppointmentTypeChange = (event) => {
    const selectedType = event.target.value;
    setAppointmentType(selectedType);
    console.log(`selected slotType is ${selectedType}`); // Use selectedType here
    fetchTimeSlots(doctorId, date, selectedType); // Pass doctorUniqueId instead of doctorId
  };

  const formatDate = (date) => {
    if (typeof date === "string") {
      date = new Date(date); // Convert string to Date object
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Adding leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent default form submission
    const tempEmail = getAuth().currentUser.email;
    setPatientEmail(tempEmail);
    const temp = fee.toString();
    const formattedDate = formatDate(date);
    const tempDate = formattedDate;
    setAppointmentDate(tempDate);
    console.log(meetingLink);
    setFee(temp);

    // Update doctorId and patientId states

    navigator("/payment", {
      state: {
        appointmentDetails: {
          hospital,
          email,
          patientName,
          profileImage,
          type,
          slotId,
          department,
          doctorName,
          date: tempDate,
          slot,
          complain,
          fee,
          doctorId,
          patientId,
          meetingLink,
        },
      },
    });
  };

  const fetchTimeSlots = async (
    doctorUniqueIdentifier,
    selectedDate,
    appointmentType
  ) => {
    try {
      const response = await axios.get(
        `${IP}:5001/api/slots/getDoctorSlots/${doctorUniqueIdentifier}`
      );

      if (response.data && response.data.length > 0) {
        let slotTimes = [];
        let totalFee = 0;
        let slotId = "";

        response.data.forEach((week) => {
          if (week.availabilitySlots && week.availabilitySlots.length > 0) {
            week.availabilitySlots.forEach((availabilitySlot) => {
              if (
                availabilitySlot.date === selectedDate &&
                availabilitySlot.detailedSlots &&
                availabilitySlot.detailedSlots.length > 0
              ) {
                availabilitySlot.detailedSlots.forEach((slot) => {
                  console.log(slot.slotType, appointmentType);

                  if (
                    slot.availability === "Available" &&
                    slot.slotType === appointmentType
                  ) {
                    setLink(slot.appointmentLink);
                    slotTimes.push({
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                      availability: slot.availability,
                      fee: slot.price,
                      slotid: slot.uuid,
                    });
                    console.log(slotTimes);
                  }
                });

                totalFee += availabilitySlot.detailedSlots[0].price;
                slotId = availabilitySlot.detailedSlots[0].uuid;
              }
            });
          }
        });

        setFee(totalFee);
        setTimeSlots(slotTimes);
        setSlotId(slotId);
      } else {
        setTimeSlots([]);
        setFee("");
        setSlotId("");
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
      setFee("");
      setSlotId("");
    }
  };

  const layoutStyle = {
    display: "flex",
    marginTop: "20px",
  };

  const contentStyle = {
    flexGrow: 1,
    marginLeft: "10px",
    marginTop: "80px",
  };

  const headingStyle = {
    color: "#333",
    textAlign: "center",
    marginBottom: "10px",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: "bold",
    fontSize: "2rem",
    marginTop: "55px",
  };

  return (
    <Box style={layoutStyle}>
      <LeftNavBar />
      <Container style={{ flexGrow: 1, marginLeft: "10px" }}>
        <Typography variant="h4" gutterBottom style={headingStyle}>
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
              value={department}
              label="Speciality"
              onChange={handleSpecialityChange}
            >
              {specialityList.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              label="Doctor"
              onChange={handleDoctorChange}
            >
              {doctorList.map((doctor) => (
                <MenuItem
                  key={doctor.doctorData.uniqueIdentifier}
                  value={`${doctor.doctorData.firstName} ${doctor.doctorData.lastName}`}
                >
                  {`${doctor.doctorData.firstName} ${doctor.doctorData.lastName}`}
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
            value={date}
            onChange={(e) => {
              setAppointmentDate(e.target.value);
              // fetchTimeSlots(doctorUniqueId, e.target.value); // Use doctorUniqueId instead of doctorId
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Appointment Mode</InputLabel>
            <Select
              value={type}
              label="Appointment Mode"
              onChange={handleAppointmentTypeChange}
            >
              <MenuItem key={"Physical"} value={"Physical"}>
                Physical
              </MenuItem>
              <MenuItem key={"Online"} value={"Online"}>
                Online
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Available Slots</InputLabel>
            <Select
              value={slot}
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
            Fee: {fee.toLocaleString()}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />} // Add arrow icon to the end of the button
            sx={{
              borderRadius: "20px",
              width: "fit-content",
              margin: "0 auto", // Center the button horizontally
              backgroundColor: "#307867",
              "&:hover": {
                backgroundColor: "#5cac9e",
              },
            }}
            onClick={handleSubmit}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default CreateAppointment;
