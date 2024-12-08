import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Box, Typography } from '@mui/material';

const UploadCertificate = () => {
  const [name, setName] = useState('');
  const [trackId, setTrackId] = useState('');
  const [trackUrl, setTrackUrl] = useState('');
  const [issuedBy, setIssuedBy] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [badge, setBadge] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('jwtToken'); // Get the JWT token from local storage

    if (!token) {
      setStatus('No JWT token found!');
      return;
    }

    if (!name || !trackId || !trackUrl || !issuedBy || !issuedDate || !expiryDate || !pdfFile || !badge) {
      setStatus('Please fill in all fields and upload both PDF and Badge!');
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("trackId", trackId);
    formData.append("trackUrl", trackUrl);
    formData.append("issuedBy", issuedBy);
    formData.append("issuedDate", issuedDate);
    formData.append("expiryDate", expiryDate);
    formData.append("pdfFile", pdfFile);
    formData.append("badge", badge);

    setStatus('Uploading...'); // Show loading status
// https://microservice2-production.up.railway.app/
    try {
      const response = await axios.post("https://microservice2-production.up.railway.app/api/certificates/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`, // Send token in header
        },
      });
      setStatus('Upload successful!');
      console.log("Upload successful:", response.data);
    } catch (error) {
      setStatus('Error uploading certificate!');
      console.error("Error uploading certificate:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
        <TextField
          label="Certificate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tracking ID"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tracking URL"
          value={trackUrl}
          onChange={(e) => setTrackUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Issued By"
          value={issuedBy}
          onChange={(e) => setIssuedBy(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Issued Date"
          type="date"
          value={issuedDate}
          onChange={(e) => setIssuedDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Expiry Date"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* File Inputs */}
        <Button variant="contained" component="label" sx={{ marginTop: '1rem' }}>
          Upload PDF
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </Button>

        <Button variant="contained" component="label" sx={{ marginTop: '1rem' }}>
          Upload Badge Image
          <input
            type="file"
            hidden
            accept="image/png, image/jpeg"
            onChange={(e) => setBadge(e.target.files[0])}
          />
        </Button>

        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: '2rem' }}>
          Upload Certificate
        </Button>

        {status && <Typography sx={{ marginTop: '1rem' }}>{status}</Typography>}
      </Box>
    </Container>
  );
};

export default UploadCertificate;
