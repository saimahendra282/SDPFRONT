import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MyMappedCerti = () => {
  const [mappedCertificates, setMappedCertificates] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [enrichedMappings, setEnrichedMappings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMapping, setCurrentMapping] = useState(null);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("jwtToken");

  const fetchMappedCertificates = async () => {
    try {
      const response = await axios.get(
        "https://microservice2-production.up.railway.app/peer-mappings/mapped/self",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      setMappedCertificates(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch mapped certificates. Please try again."
      );
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get("https://microservice2-production.up.railway.app/api/certificates/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch certificates. Please try again."
      );
    }
  };

  const enrichMappings = () => {
    const enriched = mappedCertificates.map((mapping) => {
      const certificate = certificates.find(
        (cert) => cert.id === mapping.certificateId
      );
      return {
        ...mapping,
        _id: mapping._id || mapping.id,
        certificateName: certificate ? certificate.name : "Unknown",
        username: certificate ? certificate.email : "na",
        trackId: certificate ? certificate.trackId : "Unknown",
        trackUrl: certificate ? certificate.trackUrl : "Unknown",
        issuedDate: certificate ? certificate.issuedDate : "Unknown",
        expiryDate: certificate ? certificate.expiryDate : "Unknown",
        badge: certificate ? certificate.badge : null,
        pdfFile: certificate ? certificate.pdfFile : null,
      };
    });
    setEnrichedMappings(enriched);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchMappedCertificates(), fetchCertificates()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (mappedCertificates.length > 0 && certificates.length > 0) {
      enrichMappings();
    }
  }, [mappedCertificates, certificates]);

  const handleActionClick = (mapping, action) => {
    setCurrentMapping({ ...mapping, action });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setComment("");
    setCurrentMapping(null);
  };

  const handleSubmit = async () => {
    if (!currentMapping) return;

    try {
      const { _id, action } = currentMapping;
      await axios.post(
        `https://microservice2-production.up.railway.app/peer-mappings/update-status/${_id}`,
        { status: action, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDialogOpen(false);
      setComment("");
      fetchMappedCertificates(); // Refresh data
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update status. Please try again."
      );
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" align="center" mt={4}>
        Reviewed Certificates
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Certificate Name</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Track ID</TableCell>
              <TableCell>Track URL</TableCell>
              <TableCell>Issued Date - Expiry Date</TableCell>
              <TableCell>Badge</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrichedMappings
              .filter((cert) => cert.status !== "Pending")
              .map((cert) => (
                <TableRow key={cert._id}>
                  <TableCell>{cert.certificateName}</TableCell>
                  <TableCell>{cert.username}</TableCell>
                  <TableCell>{cert.trackId}</TableCell>
                  <TableCell>
                    <a
                      href={cert.trackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Click Here
                    </a>
                  </TableCell>
                  <TableCell>{`${cert.issuedDate} - ${cert.expiryDate}`}</TableCell>
                  <TableCell>
                    {cert.badge && (
                      <img
                        src={`https://microservice2-production.up.railway.app/api/certificates/badge/${cert.badge}`}
                        alt="badge"
                        style={{ maxWidth: 50, maxHeight: 50 }}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: cert.status === "Verified" ? "green" : "red",
                    }}
                  >
                    {cert.status}
                  </TableCell>
                  <TableCell>{cert.comment || "N/A"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Enter Comment for Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for {currentMapping?.action.toLowerCase()}ing
            this certificate.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4" align="center" gutterBottom>
        My Mapped Certificates
      </Typography>

      {loading && <CircularProgress sx={{ display: "block", margin: "auto" }} />}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {enrichedMappings
          .filter((cert) => cert.status === "Pending")
          .map((cert) => (
            <Grid item xs={12} md={6} lg={4} key={cert._id}>
  <a
    href={cert.trackUrl}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: 'none', display: 'block' }}
  >
    <Card sx={{ padding: 2, textAlign: "center", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {cert.certificateName}
        </Typography>
        <Typography>Email: {cert.username}</Typography>
        <Typography>Track ID: {cert.trackId}</Typography>
        
        <Typography>
          {`${cert.issuedDate} - ${cert.expiryDate}`}
        </Typography>
        {cert.badge && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <img
              src={`https://microservice2-production.up.railway.app/api/certificates/badge/${cert.badge}`}
              alt="badge"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          </Box>
        )}
        {cert.pdfFile && (
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click action
              window.open(
                `https://microservice2-production.up.railway.app/api/certificates/pdf/${cert.pdfFile}`,
                "_blank"
              );
            }}
            sx={{ mt: 2 }}
          >
            Show Certificate
          </Button>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleActionClick(cert, "Verified")}
          >
            Verify
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleActionClick(cert, "Rejected")}
            sx={{ ml: 2 }}
          >
            Reject
          </Button>
        </Box>
      </CardContent>
    </Card>
  </a>
</Grid>

          ))}
      </Grid>
    </Box>
  );
};

export default MyMappedCerti;
