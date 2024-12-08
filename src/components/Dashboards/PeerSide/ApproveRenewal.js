import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const ApproveRenewal = () => {
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
      setMappedCertificates(response.data.filter(cert => cert.renewalRequested));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch mapped certificates.");
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get("https://microservice2-production.up.railway.app/api/certificates/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch certificates.");
    }
  };

  const enrichMappings = () => {
    const enriched = mappedCertificates.map((mapping) => {
      const certificate = certificates.find(
        (cert) => cert.id === mapping.certificateId
      );
      return {
        ...mapping,
        certificateName: certificate ? certificate.name : "Unknown",
        username: certificate ? certificate.email : "na",
        trackId: certificate ? certificate.trackId : "Unknown",
        trackUrl: certificate ? certificate.trackUrl : "Unknown",
        issuedDate: certificate ? certificate.issuedDate : "Unknown",
        expiryDate: certificate ? certificate.expiryDate : "Unknown",
        badge: certificate ? certificate.badge : null,
        pdfFile: certificate ? certificate.pdfFile : null,
        renewPdfFile: certificate ? certificate.renewPdfFile : null,
      };
    });
    setEnrichedMappings(enriched);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
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
    setCurrentMapping(null);
    setComment(""); // Reset comment field
  };

  const handleSubmit = async () => {
    if (!currentMapping) return;

    try {
      const { _id, action } = currentMapping;
      await axios.put(
        `https://microservice2-production.up.railway.app/peer-mappings/verify-renewal/${_id}`,
        { status: action, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDialogOpen(false);
      fetchMappedCertificates(); // Refresh data
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update renewal status.");
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" align="center" mt={4}>
        Approve Certificate Renewal Requests
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
                        e.stopPropagation();
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
                  {cert.renewPdfFile && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://microservice2-production.up.railway.app/api/certificates/pdf/${cert.renewPdfFile}`,
                          "_blank"
                        );
                      }}
                      sx={{ mt: 2 }}
                    >
                      View Supporting Documents
                    </Button>
                  )}
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleActionClick(cert, "Verified")}
                    >
                      Approve
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
            </Grid>
          ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Provide a Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment (optional)"
            type="text"
            fullWidth
            variant="outlined"
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
    </Box>
  );
};

export default ApproveRenewal;
