import { useEffect, useState } from "react";
import axios from "axios";

import { useLocation } from "react-router-dom";
import "../Styles/Telemed.css";
import { HeaderBox, FormContainer } from "../Components/CustomComponents";
import { Typography } from "@mui/material";
import LeftNavbar from "../Components/LeftNavBar";

function Telemedicine() {
  const [token, setToken] = useState("");
  const location = useLocation();
  const { meetingLink } = location.state;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (meetingLink) {
          // Extract room name from the appointment link
          const roomName = extractRoomNameFromLink(meetingLink);

          // Fetch token dynamically from the backend using the room name
          const response = await axios.post(
            "http://localhost:5002/api/meeting/generateToken",
            { roomName }
          );
          setToken(response.data.token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [meetingLink]); // Call fetchToken whenever appointmentLink changes

  // Function to extract room name from the appointment link
  const extractRoomNameFromLink = (link) => {
    const parts = link.split("/");
    return parts[parts.length - 1];
  };

  const iframeStyle = {
    width: "calc(100% - 40px)", // Adjust the margin on both sides (20px each)
    height: "600px", // Fixed height
    border: "0",
    margin: "20px", // Margin on all sides
    display: "block",
  };

  return (
    <>
      <LeftNavbar />
      <HeaderBox>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Telemedicine
        </Typography>
      </HeaderBox>
      <FormContainer>
        {meetingLink && token && (
          <iframe
            src={`${meetingLink}?t=${token}`}
            style={iframeStyle}
            allow="camera; microphone; fullscreen"
            enable_chat
          ></iframe>
        )}
      </FormContainer>
    </>
  );
}

export default Telemedicine;
