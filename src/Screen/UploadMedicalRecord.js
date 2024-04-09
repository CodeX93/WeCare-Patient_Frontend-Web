import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { IP } from "../assets/ConstantValues";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  FormControl,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  IconButton,
  Box,
  Modal,
  Button,
  Backdrop,
  Fade,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

function UploadMedical() {
  const Navigator = useNavigate();
  const [documentType, setDocumentType] = useState("");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [manualAdd, setManualAdd] = useState(false);
  const [medicineList, setMedicineList] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [complain, setComplain] = useState("");
  const [duration, setDuration] = useState("");
  const [dosage, setDosage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false); // State to control modal open/close
  const [RecordFile, setFile] = useState(null); // State to hold the selected file
  const auth = getAuth();
  const location = useLocation();

  const handleChange = (event) => {
    setDocumentType(event.target.value);
    setManualAdd(false);
    setMedicineList([]);
  };

  const handleManualAddChange = (event) => {
    setManualAdd(event.target.value === "manual");
    if (event.target.value === "RecordFile") {
      setMedicineList([]); // Clear medicine list if switching back to file upload mode
    }
  };

  const handleAddMedicine = () => {
    const newMedicine = { medicineName, complain, duration, dosage };
    setMedicineList([...medicineList, newMedicine]);
    // Clear input fields after adding medicine
    setMedicineName("");
    setComplain("");
    setDuration("");
    setDosage("");
  };

  const handleRemoveMedicine = (index) => {
    const updatedList = medicineList.filter((_, i) => i !== index);
    setMedicineList(updatedList);
  };

  useEffect(() => {
    // Open the modal automatically when component mounts
    if (location.state && location.state.open) {
      setOpen(true);
    }
  }, [location]);

  // Handle modal close event
  const handleClose = () => {
    setOpen(false);
    Navigator("/medical-record");
    // Call the callback function to handle the modal state change in the previous component
    if (location.state && location.state.handleModalClose) {
      location.state.handleModalClose();
    }
  };

  const postMedicalRecord = async () => {
    setIsUploading(true);
    try {
      const token = await getAuth().currentUser.uid;
      const isVisibleToDoctorBool = "true";

      console.log(token, documentType, date, title, comment, RecordFile);
      const formData = new FormData();
      formData.append("patientId", token);
      formData.append("RecordType", documentType);
      formData.append("Date", date);
      formData.append("Title", title);
      formData.append("Comment", comment);
      formData.append("isVisibleToDoctorBool", isVisibleToDoctorBool);

      // Append the file to FormData if a file is selected
      if (RecordFile) {
        console.log("Selected file:", RecordFile);
        formData.append("RecordFile", RecordFile);
      }
      // Add other fields based on the document type
      if (documentType === "prescription") {
        formData.append("Medicines", JSON.stringify(medicineList));
      }
      const url =
        documentType === "RecordFile" ||
        "prescription" ||
        "Lab Tests" ||
        "Surgical Records"
          ? `${IP}:4001/medicalrecord/medical-record/without-prescription`
          : `${IP}:4001/medicalrecord/medical-record/with-prescription`;

      const response = await axios.post(url, formData);
      console.log(response);
      alert("Uploaded");
      setIsUploading(false);
      // Reset form fields
      setDocumentType("");
      setDate("");
      setTitle("");
      setComment("");
      setManualAdd(false);
      setMedicineList([]);
      setFile(null); // Reset the file state after uploading
    } catch (error) {
      console.error("Error uploading medical record:", error);
      alert("Failed to upload");
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      setFile(file); // Set the file object itself
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    handleOpen(); // Open the modal automatically when component mounts
  }, []); // Empty dependency array to run only once when component mounts

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Upload Medical Record
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="document-type-label">Document Type</InputLabel>
            <Select
              labelId="document-type-label"
              id="document-type"
              value={documentType}
              onChange={handleChange}
              label="Document Type"
            >
              <MenuItem value="prescription">Prescription</MenuItem>
              <MenuItem value="lab tests">Lab Tests</MenuItem>
              <MenuItem value="surgical records">Surgical Records</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="date"
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Comments"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            {documentType === "prescription" && (
              <RadioGroup
                aria-label="manual-add"
                name="manual-add"
                value={manualAdd ? "manual" : "file"}
                onChange={handleManualAddChange}
                row
              >
                <FormControlLabel
                  value="RecordFile"
                  control={<Radio />}
                  label="File"
                />
                <FormControlLabel
                  value="manual"
                  control={<Radio />}
                  label="Manual Add"
                />
              </RadioGroup>
            )}

            {documentType === "prescription" &&
            documentType !== "Lab Tests" &&
            documentType !== "Surgical Records" &&
            manualAdd ? (
              <>
                <TextField
                  fullWidth
                  label="Medicine Name"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Complain"
                  value={complain}
                  onChange={(e) => setComplain(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddMedicine}
                  sx={{ mb: 2 }}
                >
                  Add Another Medicine
                </Button>
                <Grid container spacing={2}>
                  {medicineList.map((medicine, index) => (
                    <Grid item xs={12} key={index}>
                      <Typography variant="subtitle1">
                        {`Medicine ${index + 1}: ${medicine.medicineName}`}
                      </Typography>
                      <IconButton onClick={() => handleRemoveMedicine(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <Button
                  component="label"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, backgroundColor: "#307867" }}
                >
                  Upload File
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Button>
                {RecordFile && (
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Selected File: {RecordFile.name}
                  </Typography>
                )}
              </>
            )}
          </Box>
          {isUploading ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={postMedicalRecord}
              sx={{ mt: 2, backgroundColor: "#307867" }}
            >
              Upload Record
            </Button>
          )}
        </Paper>
      </Fade>
    </Modal>
  );
}

export default UploadMedical;
