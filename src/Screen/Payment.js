import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import "../Styles/payment.css";

const stripeClientKey =
  "pk_test_51N5kR5AHUmt4BX2AiORBeGUfKjZRhNIreprl0UbzsH3CPvDXwmIbDchH1b3AVqLzE1ZivesgCu6UVDMJ0RWM2laB001HKeBkks";
const stripePromise = loadStripe(stripeClientKey);

const CheckoutForm = ({ handlePaymentSuccess, appointmentDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    setTimeout(async () => {
      try {
        // Call the Stripe API here to process the payment
        // Replace with your actual Stripe payment logic

        // If payment is successful, call the parent component's function
        console.log("Payment successful!");
        handlePaymentSuccess();
      } catch (error) {
        console.error("Payment failed:", error.message);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <Typography variant="h6" gutterBottom>
        Card details
      </Typography>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              fontFamily: "Arial, sans-serif",
            },
          },
        }}
        className="card-element"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        className="pay-button"
      >
        {loading ? <CircularProgress size={24} /> : "Pay"}
      </Button>

      {/* Display appointment details */}
      <div className="appointment-details">
        <Typography variant="h6" gutterBottom>
          Appointment Details:
        </Typography>
        <Typography>Speciality: {appointmentDetails.speciality}</Typography>
        <Typography>Doctor: {appointmentDetails.doctor}</Typography>
        <Typography>
          Appointment Date: {appointmentDetails.appointmentDate}
        </Typography>
        <Typography>
          Selected Slot: {appointmentDetails.selectedSlot}
        </Typography>
        <Typography>Complaint: {appointmentDetails.complain}</Typography>
        <Typography>Fee: {appointmentDetails.fee}</Typography>
      </div>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentDetails } = location.state || {};
  console.log(appointmentDetails);
  const handlePaymentSuccess = async () => {
    try {
      // Handle successful payment here, e.g., show an alert with appointment details

      // Make a POST request to your backend API to save the appointmentDetails
      const response = await axios.post(
        "http://localhost:4003/appointment/makeappointment",
        appointmentDetails
      );

      if (response.status === 200) {
        alert("Appointment placed successfully.");
        navigate("/home");
      } else {
        alert("Error placing appointment.");
      }
    } catch (error) {
      console.error("Error posting appointment details:", error.message);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        handlePaymentSuccess={handlePaymentSuccess}
        appointmentDetails={appointmentDetails}
      />
    </Elements>
  );
};

export default Payment;
