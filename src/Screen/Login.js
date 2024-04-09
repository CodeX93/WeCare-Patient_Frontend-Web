import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import logo from "../assets/WeCare - Logo .png";
import welcomeIllustration from "../assets/welcome.png";
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
            username:
              userData.firstName && userData.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : user.displayName,
            profileImageUrl: userData.profileImage || "",
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

  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  return (
    <Container maxWidth="lg">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "100vh",
        }}
      >
        {isLargeScreen && (
          // Left Section (70%)
          <div style={{ flex: "0 0 70%", padding: "2rem" }}>
            <Typography variant="h4" gutterBottom>
              Welcome
            </Typography>
            <Typography variant="body1" gutterBottom>
              The Most advanced EMR system of Pakistan
            </Typography>
            <img
              src={welcomeIllustration}
              alt="Welcome Image"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}

        {/* Right Section (30%) */}
        <Paper
          elevation={3}
          style={{
            flex: "0 0 30%",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="Welcome Image"
            style={{ maxWidth: "auto", height: "300px", marginBottom: "2rem" }}
          />
          <Typography variant="h5" gutterBottom>
            Login Now
          </Typography>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
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
              style={{
                marginTop: "2rem",
                backgroundColor: "#307867",
                color: "#fff",
              }}
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <Link
            to="/signup"
            style={{ textDecoration: "none", marginTop: "1rem" }}
          >
            Not a User? Sign up now
          </Link>
        </Paper>
      </div>
    </Container>
  );
}

export default Login;
