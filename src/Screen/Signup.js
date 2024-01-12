import React, { useState } from "react";
import { auth, db } from "../Firebase-config"; // Adjust the path as necessary
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { useNavigate } from "react-router-dom";

function Signup() {
  const navigator = useNavigate();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [city, setCity] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const calculateAge = (dob) => {
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Set the file to state
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDobChange = (event) => {
    const newDob = event.target.value;
    setDob(newDob);
    setAge(calculateAge(newDob));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true); // Start loading
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      let downloadURL = null;
      if (file) {
        const storageRef = ref(
          getStorage(),
          `patientprofile/${userCredential.user.uid}`
        );
        const uploadTask = await uploadBytesResumable(storageRef, file);
        downloadURL = await getDownloadURL(uploadTask.ref);
      } else {
        downloadURL =
          "https://img.freepik.com/free-photo/user-front-side-with-white-background_187299-40007.jpg?w=1380&t=st=1702069224~exp=1702069824~hmac=247964e003bb44749050c5cd4255554ef2a7eb3de36798b0d855817727662d78";
      }

      // Update profile in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: name,
        name,
        email,
        dob,
        age,
        gender,
        bloodGroup,
        contactNo,
        city,
        profileImage: downloadURL, // Store image URL
      });

      console.log("User created:", userCredential.user.uid);
      navigator("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
      // Handle errors (e.g., user already exists)
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20vh" }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <Button
            variant="outlined"
            component="label"
            style={{ display: "block", margin: "10px auto" }}
          >
            <Avatar
              src={profileImage}
              style={{ width: "100px", height: "100px", margin: "10px auto" }}
            />

            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <TextField
            id="dob"
            label="Date of Birth"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            name="dob"
            value={dob}
            onChange={handleDobChange}
          />
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            Age: {age}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              label="Gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="bloodGroup"
            label="Blood Group"
            name="bloodGroup"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="city"
            label="Ciy"
            name="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="contactNo"
            label="Contact No"
            name="contactNo"
            type="tel"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "20px 0" }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
export default Signup;
