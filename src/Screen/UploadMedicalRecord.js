import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftNavBar from "../Components/LeftNavBar";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth } from "firebase/auth";

import {
  Button,
  Grid,
  Paper,
  Typography,
  Modal,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardMedia,
  CardContent,
  Container,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Radio,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";

function PatientUpload() {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [editRecordIndex, setEditRecordIndex] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false); // Separate editing modal
  const [openPostModal, setOpenPostModal] = useState(false); // Separate posting modal
  const [visibility, setVisibility] = useState("true");
  const [isUploading, setIsUploading] = useState(false);
  const [tempid, setTempId] = useState("");

  const auth = getAuth();

  const handleChange = (event) => {
    setVisibility(event.target.value);
  };

  const toggleVisibility = (index) => {
    const newRecords = [...medicalRecords];
    newRecords[index].Visibility =
      newRecords[index].Visibility === "true" ? "false" : "true";
    setMedicalRecords(newRecords);
  };

  // Function to delete a record
  const deleteRecord = async (id) => {
    console.log(id);
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        // Call your API to delete the record
        await axios.delete(`http://localhost:4001/medicalrecord/delete/${id}`);
        // Filter out the record from the state
        const newRecords = medicalRecords.filter((record) => record.id !== id);
        setMedicalRecords(newRecords);
      } catch (error) {
        console.error("Error deleting medical record:", error);
      }
    }
  };

  // Function to open edit modal for a specific record
  const openEditRecordModal = (index) => {
    setEditRecordIndex(index);
    setOpenEditModal(true); // Open the editing modal
    // Set the form fields to the values of the record being edited

    const recordToDisplay = medicalRecords.find(
      (record) => record.id === index
    );

    setDocumentType(recordToDisplay.RecordType);
    setDate(recordToDisplay.Date);
    setTitle(recordToDisplay.RecordTitle);
    setComment(recordToDisplay.Result);
    setVisibility(recordToDisplay.Visibility);
    setTempId(index);
  };

  // Function to save the edited record
  const saveEdit = async () => {
    try {
      const editedRecord = {
        RecordType: documentType,
        Date: date,
        RecordTitle: title,
        Result: comment,
        Visibility: visibility,
      };
      console.log(tempid);
      // Send a PUT or PATCH request to update the record
      const response = await axios.put(
        `http://localhost:4001/medicalrecord/update/${tempid}`,
        editedRecord
      );

      // Update the state with the edited record
      const newRecords = [...medicalRecords];
      newRecords[editRecordIndex] = {
        ...newRecords[editRecordIndex],
        ...editedRecord,
      };
      setMedicalRecords(newRecords);

      setOpenEditModal(false);
      setDocumentType("");
      setTitle("");
      setDate("");
      setUploadedImage(null); // Clear the file
      setComment("");
      setVisibility("");
      setOpenPostModal(false); // Close the edit modal
    } catch (error) {
      console.error("Error updating medical record:", error);
    }
  };

  const postMedicalRecord = async () => {
    setIsUploading(true);
    try {
      const token = await auth.currentUser.uid; // Ensure currentUser is not null
      const formData = new FormData();
      formData.append("RecordType", documentType);
      formData.append("RecordTitle", title);
      formData.append("Date", date);
      formData.append("PatientId", token);
      if (uploadedImage) {
        formData.append("RecordFile", uploadedImage, uploadedImage.name);
      }
      formData.append("Result", comment);
      formData.append("Visiblity", visibility);

      // Sending the POST request without setting the Content-Type header
      const response = await axios.post(
        "http://localhost:4001/medicalrecord/add",
        formData
      );

      console.log(response.data);
      alert("Uploaded");
      setIsUploading(false);

      // Resetting the form fields
      setDocumentType("");
      setTitle("");
      setDate("");
      setUploadedImage(null); // Clear the file
      setComment("");
      setVisibility("");
      setOpenPostModal(false);
    } catch (error) {
      console.error("Error uploading medical record:", error);
      alert("Failed to upload");
      setIsUploading(false);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const layoutStyle = {
    display: "flex",
    marginTop: "20px",
  };

  const contentStyle = {
    flexGrow: 1,
    marginLeft: "10px",
  };

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/medicalrecord/allrecords"
        );
        setMedicalRecords(response.data.medicalRecords); // Set fetched records
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    };

    fetchMedicalRecords();
  }, [medicalRecords]);

  return (
    <Box style={layoutStyle}>
      <LeftNavBar />
      <Container style={contentStyle}>
        <Paper style={{ padding: "20px", margin: "20px" }}>
          <Modal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            aria-labelledby="modal-edit-title"
            aria-describedby="modal-edit-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-edit-title" variant="h6" component="h2">
                Edit Record
              </Typography>
              <Grid container spacing={2} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="edit-document-type-label">
                      Document Type
                    </InputLabel>
                    <Select
                      labelId="edit-document-type-label"
                      id="edit-document-type"
                      value={documentType}
                      label="Document Type"
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      <MenuItem value="Lab Test">Lab Test</MenuItem>
                      <MenuItem value="Prescription">Prescription</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="edit-date"
                    label="Date"
                    type="date"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Grid item xs={12} spacing={2} marginTop={"20px"}>
                    <TextField
                      id="edit-comment"
                      label="Comment/Result"
                      type="text"
                      fullWidth
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Grid>

                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="visibility"
                      name="edit-visibility"
                      value={visibility}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Public"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="Private"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {isUploading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  onClick={saveEdit}
                >
                  Save Edit
                </Button>
              )}
            </Box>
          </Modal>
          <Modal
            open={openPostModal}
            onClose={() => setOpenPostModal(false)}
            aria-labelledby="modal-post-title"
            aria-describedby="modal-post-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-post-title" variant="h6" component="h2">
                Upload New Document
              </Typography>
              <Grid container spacing={2} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="post-document-type-label">
                      Document Type
                    </InputLabel>
                    <Select
                      labelId="post-document-type-label"
                      id="post-document-type"
                      value={documentType}
                      label="Document Type"
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      <MenuItem value="Lab Test">Lab Test</MenuItem>
                      <MenuItem value="Prescription">Prescription</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="post-date"
                    label="Date"
                    type="date"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="post-raised-button-file"
                    type="file"
                    onChange={(e) => setUploadedImage(e.target.files[0])}
                  />
                  <label htmlFor="post-raised-button-file">
                    <Button variant="outlined" color="primary" component="span">
                      Attach Record
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Grid item xs={12} spacing={2} marginTop={"20px"}>
                    <TextField
                      id="post-comment"
                      label="Comment/Result"
                      type="text"
                      fullWidth
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Grid>

                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="visibility"
                      name="post-visibility"
                      value={visibility}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Public"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="Private"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {isUploading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  onClick={postMedicalRecord}
                >
                  Upload Record
                </Button>
              )}
            </Box>
          </Modal>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="20px"
          >
            <Typography
              variant="h5"
              style={{ marginTop: "20px", marginBottom: "10px" }}
            >
              Uploaded Documents
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenPostModal(true)}
            >
              Add Record
            </Button>
          </Box>
          <Grid container spacing={2}>
            {medicalRecords.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card style={{ height: "100%" }} key={item.id}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.RecordFile}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {item.RecordTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {item.RecordType}
                      <br />
                      Date: {new Date(item.Date).toLocaleDateString()}
                    </Typography>
                    <IconButton onClick={() => openEditRecordModal(item.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => toggleVisibility(index)}>
                      Visibility:{" "}
                      {item.Visibility ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}{" "}
                    </IconButton>
                    <IconButton
                      onClick={() => deleteRecord(item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default PatientUpload;
