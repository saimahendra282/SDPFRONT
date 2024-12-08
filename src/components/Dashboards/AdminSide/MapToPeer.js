import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MapToPeer = () => {
  const [peers, setPeers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [mappedDetails, setMappedDetails] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState("");
  const [selectedPeerName, setSelectedPeerName] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch peers from the backend
  const fetchPeers = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("https://microservice1-production.up.railway.app/api/users/peers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPeers(response.data);
    } catch (error) {
      setError("Failed to fetch peers. Please try again.");
    }
  };

  // Fetch certificates from the backend
  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        "https://microservice2-production.up.railway.app/api/certificates/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificates(response.data);
    } catch (error) {
      setError("Failed to fetch certificates. Please try again.");
    }
  };

  // Fetch mapped details and enrich them
  const fetchMappedDetails = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        "https://microservice2-production.up.railway.app/peer-mappings/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mappings = response.data;

      // Simplified approach: Directly match the certificateId
      const enrichedMappings = mappings.map((mapping) => {
        const certificate = certificates.find(
          (cert) => cert.id === mapping.certificateId
        );
        return {
          ...mapping,
          certificateName: certificate ? certificate.name : "Unknown",
          trackId: certificate ? certificate.trackId : "Unknown",
          status: mapping.status || "Pending", // Add default value for status
          comment: mapping.comment || "No comment", // Add default value for comment
        };
      });

      setMappedDetails(enrichedMappings);
    } catch (error) {
      setError("Failed to fetch mapped details. Please try again.");
    }
  };

  // Handle peer selection
  const handlePeerSelect = (email) => {
    setSelectedPeer(email);
    const peer = peers.find((p) => p.email === email);
    if (peer) setSelectedPeerName(peer.name);
  };

  // Handle certificate selection
  const handleCertificateSelect = (id) => {
    setSelectedCertificate(id);
  };

  // Map certificate to peer
  const mapToPeer = async () => {
    if (!selectedPeer || !selectedCertificate) {
      setMessage("Please select both peer and certificate.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "https://microservice2-production.up.railway.app/peer-mappings/add",
        {
          peerEmail: selectedPeer,
          peerName: selectedPeerName,
          certificateId: selectedCertificate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Mapping successful!");
      fetchMappedDetails(); // Refresh mapped details after successful mapping
    } catch (error) {
      setMessage("Failed to map certificate to peer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeers();
    fetchCertificates();
    fetchMappedDetails();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Map Certificate to Peer
      </Typography>
      {message && (
        <Alert
          severity={message.includes("Failed") ? "error" : "success"}
          sx={{ marginBottom: 2 }}
        >
          {message}
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Select Peer</Typography>
              <FormControl fullWidth>
                <InputLabel>Select Peer</InputLabel>
                <Select
                  value={selectedPeer}
                  onChange={(e) => handlePeerSelect(e.target.value)}
                >
                  {peers.map((peer) => (
                    <MenuItem key={peer.email} value={peer.email}>
                      {peer.name} ({peer.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Select Certificate</Typography>
              <FormControl fullWidth>
                <InputLabel>Select Certificate</InputLabel>
                <Select
                  value={selectedCertificate}
                  onChange={(e) => handleCertificateSelect(e.target.value)}
                >
                  {certificates.map((cert) => (
                    <MenuItem key={cert.id} value={cert.id}>
                      {cert.name} (Track ID: {cert.trackId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={mapToPeer}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Map Certificate"}
        </Button>
      </Box>

      <Box sx={{ marginTop: 5 }}>
        <Typography variant="h5">Mapped Details</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Peer Name</TableCell>
                <TableCell>Peer Email</TableCell>
                <TableCell>Certificate Name</TableCell>
                <TableCell>Track ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mappedDetails.map((detail) => (
                <TableRow key={detail._id}>
                  <TableCell>{detail.peerName}</TableCell>
                  <TableCell>{detail.peerEmail}</TableCell>
                  <TableCell>{detail.certificateName}</TableCell>
                  <TableCell>{detail.trackId}</TableCell>
                  <TableCell>{detail.status}</TableCell>
                  <TableCell>{detail.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default MapToPeer;
