import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';

const TrackCerti = () => {
  const [certificates, setCertificates] = useState([]);
  const [peerMappings, setPeerMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage
      if (!token) {
        setError('No JWT token found!');
        setLoading(false);
        return;
      }

      try {
        const certResponse = await axios.get('https://microservice2-production.up.railway.app/api/certificates/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mappingResponse = await axios.get('https://microservice2-production.up.railway.app/peer-mappings/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCertificates(certResponse.data); // Set certificates state
        setPeerMappings(mappingResponse.data); // Set peer mappings state
      } catch (err) {
        setError('Error fetching certificates: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'green';
      case 'rejected':
        return '#f44336'; // Red
      case 'pending':
        return '#ff9800'; // Yellow
      case 'Not mapped to peer':
        return '#9e9e9e'; // Grey
      default:
        return '#9e9e9e'; // Grey for any unknown status
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: 3 }}>
        My Certificates
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {certificates.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">No certificates found.</Typography>
        ) : (
          certificates.map((cert) => {
            // Find if there's a matching peer mapping for the certificate
            const peerMapping = peerMappings.find(
              (mapping) => mapping.certificateId?.toString() === cert.id?.toString()
            );

            const status = peerMapping ? peerMapping.status : 'Not mapped to peer';
            const reason = peerMapping ? peerMapping.comment : 'No comment';
            const statusColor = getStatusColor(status);

            return (
              <Grid item xs={12} sm={6} md={4} key={cert.id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {cert.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Email:</strong> {cert.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Track ID:</strong> {cert.trackId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Track URL:</strong> {cert.trackUrl}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Issued By:</strong> {cert.issuedBy}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Issued On:</strong> {formatDate(cert.issuedDate)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Expires On:</strong> {formatDate(cert.expiryDate)}
                    </Typography>

                    {/* Status and comment */}
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Status:</strong>
                      <Box
                        sx={{
                          backgroundColor: statusColor,
                          color: 'white',
                          borderRadius: '16px',
                          padding: '5px 10px',
                          display: 'inline-block',
                        }}
                      >
                        {status}
                      </Box>
                    </Typography>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <strong>Comment:</strong> {reason}
                    </Typography>

                    {/* Conditionally show PDF and badge */}
                    <Box display="flex" flexDirection="column" alignItems="center">
                      {cert.pdfFile && (
                        <Button
                          variant="contained"
                          color="primary"
                          href={`https://microservice2-production.up.railway.app/api/certificates/pdf/${cert.pdfFile}`}
                          target="_blank"
                          fullWidth
                          sx={{ marginTop: 2, textTransform: 'none' }}
                        >
                          View PDF
                        </Button>
                      )}
                      {cert.badge && (
                        <Box sx={{ marginTop: 2 }}>
                          <img
                            src={`https://microservice2-production.up.railway.app/api/certificates/badge/${cert.badge}`}
                            alt="Badge"
                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                          />
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default TrackCerti;
