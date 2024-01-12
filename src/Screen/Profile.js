import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LeftNavBar from "../Components/LeftNavBar";
import {
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user data from your database using the user's UID
        axios
          .post("http://localhost:4008/patient/get", { uid: user.uid })
          .then((response) => {
            setProfile(response.data); // Set the user data to state
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        // User is signed out
        // Handle user sign out here
      }
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (event) => {
    // Assume here you will upload the file to your server and get the URL in response
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (profile) {
      // Replace ':id' with the actual ID of the patient.
      // Ensure that this ID matches the ID in the database.
      const patientId = profile.id; // Change to the correct property name that contains the ID
      axios
        .put(`http://localhost:4008/patient/update/${patientId}`, profile)
        .then((response) => {
          // console.log("Profile updated successfully", response.data);
          setSuccessMessageOpen(true);

          // Handle the successful response here
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          // Handle the error here
        });
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessageOpen(false);
  };

  if (!profile) {
    return <div>Loading...</div>; // Show a loading state while waiting for profile data
  }

  return (
    <Box sx={{ display: "flex", mt: 4 }}>
      <LeftNavBar />
      <Container maxWidth="sm" sx={{ flexGrow: 1, ml: 2 }}>
        <Typography variant="h6" gutterBottom>
          Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleProfilePictureChange}
          />
          <label htmlFor="raised-button-file">
            <Avatar
              src={profile.profileImage}
              sx={{ width: 56, height: 56, mb: 2, cursor: "pointer" }}
              alt="Profile Picture"
              style={{ width: "100px", height: "100px", margin: "10px auto" }}
            />
          </label>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={profile.displayName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={profile.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={profile.dob}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={profile.age}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Blood Group"
            name="bloodGroup"
            value={profile.bloodGroup}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Contact Number"
            name="contactNumber"
            type="tel"
            value={profile.contactNo}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
          <Snackbar
            open={successMessageOpen}
            autoHideDuration={3500}
            onClose={handleCloseSnackbar}
            message="Profile updated successfully!"
          />
        </form>
      </Container>
    </Box>
  );
};

export default Profile;
