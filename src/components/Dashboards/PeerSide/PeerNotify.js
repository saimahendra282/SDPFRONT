import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

const PeerNotify = () => {
  const [sendAsBulk, setSendAsBulk] = useState(false);
  const [users, setUsers] = useState([]);
  const [peers, setPeers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [loadingPeers, setLoadingPeers] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (endpoint, setData, setLoading) => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData('https://microservice1-production.up.railway.app/api/users/peers', setPeers, setLoadingPeers);
    fetchData('https://microservice1-production.up.railway.app/api/users/adminusers', setUsers, setLoadingUsers);
    fetchData('https://microservice1-production.up.railway.app/api/users/alladmins', setAdmins, setLoadingAdmins);
  }, []);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    const notificationData = {
      email: sendAsBulk ? 'bulk' : selectedRecipient,
      message: message,
      role: sendAsBulk
        ? 'bulk'
        : peers.some((peer) => peer.email === selectedRecipient)
        ? 'peer'
        : admins.some((admin) => admin.email === selectedRecipient)
        ? 'admin'
        : 'user',
      department: sendAsBulk
        ? null
        : peers.find((peer) => peer.email === selectedRecipient)?.dept || null,
    };

    try {
      const response = await fetch(
        `https://microservice1-production.up.railway.app/notifications/store?isBulk=${sendAsBulk}`,
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

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Peer Notification
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendAsBulk}
                  onChange={(e) => setSendAsBulk(e.target.checked)}
                />
              }
              label="Send as Bulk"
            />
          </Grid>

          {!sendAsBulk && (
            <Grid item xs={12}>
              {loadingPeers || loadingUsers || loadingAdmins ? (
                <CircularProgress />
              ) : (
                <Select
                  fullWidth
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    {peers.length === 0 && users.length === 0 && admins.length === 0
                      ? 'No users, admins, or peers available'
                      : 'Select Recipient'}
                  </MenuItem>
                  {peers.map((peer) => (
                    <MenuItem key={peer.email} value={peer.email}>
                      {`${peer.name} - Peer (${peer.dept})`}
                    </MenuItem>
                  ))}
                  {users.map((user) => (
                    <MenuItem key={user.email} value={user.email}>
                      {`${user.name} - User`}
                    </MenuItem>
                  ))}
                  {admins.map((admin) => (
                    <MenuItem key={admin.email} value={admin.email}>
                      {`${admin.name} - Admin`}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {error && (
                <Alert severity="warning" sx={{ marginTop: 2 }}>
                  {error}
                </Alert>
              )}
            </Grid>
          )}

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

export default PeerNotify;
