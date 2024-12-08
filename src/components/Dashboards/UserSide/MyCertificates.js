import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [peerMappings, setPeerMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No JWT token found!');
        setLoading(false);
        return;
      }

      try {
        const certResponse = await axios.get('https://microservice2-production.up.railway.app/api/certificates/email', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mappingResponse = await axios.get('https://microservice2-production.up.railway.app/peer-mappings/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCertificates(certResponse.data);
        setPeerMappings(mappingResponse.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError('Error fetching data: ' + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'green'; // Green
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

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Track Link</strong></TableCell>
              <TableCell><strong>Issued By</strong></TableCell>
              <TableCell><strong>Issued On</strong></TableCell>
              <TableCell><strong>Expires On</strong></TableCell>
              <TableCell><strong>Badge</strong></TableCell>
              <TableCell><strong>PDF</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Reason</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="h6" color="textSecondary">You have no certificates.</Typography>
                </TableCell>
              </TableRow>
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
                  <TableRow
                    key={cert.id}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      margin: '10px 0',
                      '&:hover': { backgroundColor: '#fafafa' },
                    }}
                  >
                    <TableCell>{cert.name}</TableCell>
                    <TableCell>
                      <a
                        href={cert.trackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                      >
                        {cert.trackId}
                      </a>
                    </TableCell>
                    <TableCell>{cert.issuedBy}</TableCell>
                    <TableCell>{formatDate(cert.issuedDate)}</TableCell>
                    <TableCell>{formatDate(cert.expiryDate)}</TableCell>
                    <TableCell>
                      {cert.badge && (
                        <img
                          src={`https://microservice2-production.up.railway.app/api/certificates/badge/${cert.badge}`}
                          alt="Badge"
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {cert.pdfFile && (
                        <Button
                          variant="contained"
                          color="primary"
                          href={`https://microservice2-production.up.railway.app/api/certificates/pdf/${cert.pdfFile}`}
                          target="_blank"
                          size="small"
                          sx={{ textTransform: 'none' }}
                        >
                          View PDF
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: statusColor,
                          color: 'white',
                          borderRadius: '16px',
                          padding: '5px 10px',
                          textAlign: 'center',
                        }}
                      >
                        {status}
                      </Box>
                    </TableCell>
                    <TableCell>{reason}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyCertificates;
