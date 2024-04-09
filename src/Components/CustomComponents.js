import { styled } from "@mui/system";
import { Button, Container, Box } from "@mui/material";

const color = "#6C63FF";
const secondaryColor = "#d2d0ff";

export const PrimaryButton = styled(Button)({
  backgroundColor: color,
  borderRadius: "10px",
  textDecoration: "none",
  padding: "5px 16px",
});

export const DeleteButton = styled(Button)({
  borderRadius: "10px",
  textDecoration: "none",
  padding: "5px 16px",
});

export const SecondaryButton = styled(Button)({
  backgroundColor: secondaryColor,
  borderRadius: "10px",
  textDecoration: "none",
  color: color,
  padding: "5px 16px",
});

export const FormContainer = styled(Container)({
  maxWidth: "lg",
  marginTop: "4px",
  padding: "30px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
});

export const HeaderBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "15px",
});
