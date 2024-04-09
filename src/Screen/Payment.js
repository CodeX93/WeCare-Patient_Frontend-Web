import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import "../Styles/payment.css";
import { IP } from "../assets/ConstantValues";

const stripeClientKey =
  "pk_test_51OxWu1Hdm4ffwvcmi9EKQdEFRNwStMxm7rwGnN77iGXtg6uiYcbzZE8CafzhhiAR1lDgZC8momWK1IrVvqT7Fj0K00TCjCzH2y";
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

    try {
      // Call your backend API to create a payment intent
      const response = await axios.post(`${IP}:4641/create-payment-intent`, {
        amount: appointmentDetails.fee, // Assuming fee is the amount to be paid
        currency: "usd", // Assuming the currency is USD, change it if needed
      });
      console.log(appointmentDetails.appointmentLink);

      const clientSecret = response.data.clientSecret;

      // Use the client secret to confirm the payment on the client side
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: appointmentDetails.doctorName,
          },
        },
      });

      if (result.error) {
        console.error("Payment failed:", result.error.message);
      } else {
        console.log("Payment successful:", result.paymentIntent);
        // If payment is successful, call the parent component's function
        handlePaymentSuccess();
      }
    } catch (error) {
      console.error("Payment failed:", error.message);
    } finally {
      setLoading(false);
    }
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
        <Typography>Hospital At: {appointmentDetails.hospital}</Typography>
        <Typography>Speciality: {appointmentDetails.department}</Typography>
        <Typography>Doctor: {appointmentDetails.doctorName}</Typography>
        <Typography>Appointment Date: {appointmentDetails.date}</Typography>
        <Typography>Appointment Mode: {appointmentDetails.type}</Typography>
        <Typography>Selected Slot: {appointmentDetails.slot}</Typography>
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

  const handlePaymentSuccess = async () => {
    try {
      // Handle successful payment here, e.g., show an alert with appointment details
      console.log(appointmentDetails);
      // Make a POST request to your backend API to save the appointmentDetails
      const response = await axios.post(
        `${IP}:3067/appointment/makeappointment`,
        appointmentDetails
      );

      if (response.status === 200 || response.status === 201) {
        alert("Appointment placed successfully.");

        console.log(appointmentDetails.slotId);
        try {
          // Prepare data for updating slot availability
          const slotData = {
            uniqueIdentifier: appointmentDetails.doctorId, // Assuming doctorId is available in appointmentDetails
            slotUuid: appointmentDetails.slotId,
            newStatus: "Booked", // Assuming the new status should be "Booked"
          };

          const updateResponse = await axios.post(
            "http://localhost:5001/api/slots/updateAvailibility",
            slotData
          );

          if (updateResponse.status === 200) {
            console.log("Slot booking updated successfully.", "success");
            navigate("/home");
          }
        } catch (error) {
          console.log("Error in updating availability:", error);
        }
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
