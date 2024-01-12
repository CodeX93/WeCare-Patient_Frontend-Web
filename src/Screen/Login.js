import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../Context/UserContext";
import { db } from "../Firebase-config";

function Login() {
  const Navigator = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            username: userData.displayName || user.displayName,
            profileImageUrl: userData.profileImage, // Set the profile image URL
          });
        } else {
          console.error("No user data found in Firestore");
          setUser({
            username: user.displayName,
            profileImageUrl: null,
          });
        }
        Navigator("/home");
      }
    } catch (error) {
      alert("Invalid Credentials");
      console.error("Login failed:", error.message);
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20vh" }}>
        <Typography component="h1" variant="h5">
          Patient Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            name="email"
            value={email}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "20px 0" }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
        <Link to="/signup" style={{ textDecoration: "none" }}>
          Not a User? Sign up now
        </Link>
      </Paper>
    </Container>
  );
}

export default Login;
