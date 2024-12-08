import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

const UserNotify = () => {
  const [peers, setPeers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
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
        // Fetch peers
        const peerResponse = await axios.get('https://microservice1-production.up.railway.app/api/users/peers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPeers(peerResponse.data);

        // Fetch admins
        const adminResponse = await axios.get('https://microservice1-production.up.railway.app/api/users/alladmins', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(adminResponse.data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    const notificationData = {
      email: selectedRecipient,
      message: message,
      role: 'user', // Role is always user for this component
    };

    try {
      const response = await fetch(
        `https://microservice1-production.up.railway.app/notifications/store?isBulk=false`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(notificationData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to send notification');
      }

      alert('Notification sent successfully!');
      setMessage(''); // Clear the message after sending
    } catch (error) {
      alert('Error sending notification: ' + error.message);
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        User Notification
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom align="center">
              Select Recipient
            </Typography>
            <Select
              fullWidth
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                {admins.length === 0 && peers.length === 0
                  ? 'No admins or peers available'
                  : 'Select Recipient'}
              </MenuItem>
              {admins.map((admin) => (
                <MenuItem key={admin.email} value={admin.email}>
                  {`${admin.name} - Admin`}
                </MenuItem>
              ))}
              {peers.map((peer) => (
                <MenuItem key={peer.email} value={peer.email}>
                  {`${peer.name} - ${peer.dept}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendNotification}
            >
              Send Notification
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserNotify;
