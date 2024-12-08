import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit } from '@mui/icons-material';

const MappedPeers = () => {
  const [peers, setPeers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [peerMappings, setPeerMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No JWT token found!');
        setLoading(false);
        return;
      }

      try {
        // Fetch certificates
        const certResponse = await axios.get('https://microservice2-production.up.railway.app/api/certificates/email', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const certData = certResponse.data;
        setCertificates(certData);

        // If no certificates, skip fetching peers and mappings
        if (certData.length === 0) {
          setError('No certificates uploaded or no mappings available.');
          setLoading(false);
          return;
        }

        // Fetch peers
        const peerResponse = await fetch('https://microservice1-production.up.railway.app/api/users/peers', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const peerData = await peerResponse.json();
        setPeers(peerData);

        // Fetch peer mappings
        const mappingResponse = await axios.get('https://microservice2-production.up.railway.app/peer-mappings/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPeerMappings(mappingResponse.data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Match peers with mappings
  const mappedPeers = peers.filter((peer) =>
    peerMappings.some((mapping) => mapping.peerEmail === peer.email)
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Mapped Peer Details
      </Typography>
      {mappedPeers.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          No peers mapped to your certificates.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {mappedPeers.map((peer) => (
            <Grid item key={peer.email} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ maxWidth: 345, position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={peer.profilePic || '/default-avatar.png'} // Fallback to default image
                  alt={peer.name}
                  sx={{
                    objectFit: 'cover',
                    borderRadius: '50%',
                    width: '140px',
                    height: '140px',
                    margin: 'auto',
                    marginTop: 2,
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <Edit />
                </IconButton>
                <CardContent>
                  <Typography variant="h6" align="center">
                    <b>{peer.name}</b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    Specialised in {peer.dept}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 2 }}>
                    <b>Email:</b> {peer.email}
                  </Typography>
                  <Typography variant="body2">
                    <b>Phone:</b> {peer.phone || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MappedPeers;
