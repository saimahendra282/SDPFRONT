import React, { useEffect, useState } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Divider, Avatar, IconButton
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

// Registering the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [peersCount, setPeersCount] = useState(0);
  const [adminsCount, setAdminsCount] = useState(0);
  const [certificates, setCertificates] = useState([]);
  const [peerMappings, setPeerMappings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bulkNotifications, setBulkNotifications] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [adminProfiles, setAdminProfiles] = useState([]);
  const [peerProfiles, setPeerProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get the logged-in user's email
  const loggedInUserEmail = localStorage.getItem('UserEmail');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No JWT token found. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch user data
        const userResponse = await fetch('https://microservice1-production.up.railway.app/api/users/adminusers', { headers: { Authorization: `Bearer ${token}` } });
        if (!userResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await userResponse.json();
        setUsersCount(usersData.length);
        setUserProfiles(usersData);

        // Fetch admin data
        const adminResponse = await fetch('https://microservice1-production.up.railway.app/api/users/alladmins', { headers: { Authorization: `Bearer ${token}` } });
        if (!adminResponse.ok) throw new Error('Failed to fetch admins');
        const adminsData = await adminResponse.json();
        setAdminsCount(adminsData.length);
        setAdminProfiles(adminsData);

        // Fetch peer data
        const peerResponse = await fetch('https://microservice1-production.up.railway.app/api/users/peers', { headers: { Authorization: `Bearer ${token}` } });
        if (!peerResponse.ok) throw new Error('Failed to fetch peers');
        const peersData = await peerResponse.json();
        setPeersCount(peersData.length);
        setPeerProfiles(peersData);

        // Fetch certificates data
        const certResponse = await fetch('https://microservice2-production.up.railway.app/api/certificates/all', { headers: { Authorization: `Bearer ${token}` } });
        if (!certResponse.ok) throw new Error('Failed to fetch certificates');
        const certData = await certResponse.json();
        setCertificates(certData);

        // Fetch peer mappings data
        const peerMappingResponse = await fetch('https://microservice2-production.up.railway.app/peer-mappings/all', { headers: { Authorization: `Bearer ${token}` } });
        if (!peerMappingResponse.ok) throw new Error('Failed to fetch peer mappings');
        const peerMappingData = await peerMappingResponse.json();
        setPeerMappings(peerMappingData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('https://microservice1-production.up.railway.app/notifications/allnoti', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allNotifications = response.data;

        // Filter notifications for the logged-in user
        const userNotifications = allNotifications.filter(notification => notification.email === loggedInUserEmail);
        setNotifications(userNotifications);

        // Separate notifications that are sent to "bulk" recipients
        const bulkMessages = allNotifications.filter(notification => notification.email === 'bulk');
        setBulkNotifications(bulkMessages);
      } catch (error) {
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchNotifications();
  }, [loggedInUserEmail]);

  const getProfilePic = (email) => {
    // Check if the sender is a user, admin, or peer
    const user = userProfiles.find(profile => profile.email === email);
    if (user) return user.profilePic;
    const admin = adminProfiles.find(profile => profile.email === email);
    if (admin) return admin.profilePic;
    const peer = peerProfiles.find(profile => profile.email === email);
    if (peer) return peer.profilePic;
    return null;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: 3, color: '#333' }}>
        Admin Dashboard
      </Typography>
      
      {/* Quick Statistics Section */}
      <Grid container spacing={4} justifyContent="center">
        {/* User vs Peer Bar Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>Users vs Peers</Typography>
            <Bar
              data={{
                labels: ['Users', 'Peers', 'Admins'],
                datasets: [{
                  label: 'Count',
                  data: [usersCount, peersCount, adminsCount],
                  backgroundColor: ['#4CAF50', '#FF5722', '#2196F3'],
                  borderColor: ['#4CAF50', '#FF5722', '#2196F3'],
                  borderWidth: 1,
                }],
              }}
              options={{ responsive: true, plugins: { title: { display: true, text: 'Users vs Peers Overview' } } }}
            />
          </Box>
        </Grid>

        {/* Certificates Pie Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>Certificate Status</Typography>
            <Pie
              data={{
                labels: ['Total Certificates', 'Mapped Certificates'],
                datasets: [{
                  label: 'Certificates',
                  data: [certificates.length, peerMappings.length],
                  backgroundColor: ['#2196F3', '#FF9800'],
                  borderColor: ['#2196F3', '#FF9800'],
                  borderWidth: 1,
                }],
              }}
              options={{ responsive: true, plugins: { title: { display: true, text: 'Certificates Overview' } } }}
            />
          </Box>
        </Grid>

        {/* Peer Mappings Pie Chart */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>Peer Mappings</Typography>
            <Pie
              data={{
                labels: ['Verified', 'Rejected', 'Pending'],
                datasets: [{
                  label: 'Peer Mappings',
                  data: [
                    peerMappings.filter(mapping => mapping.status === 'Verified').length,
                    peerMappings.filter(mapping => mapping.status === 'Rejected').length,
                    peerMappings.filter(mapping => mapping.status === 'Pending').length
                  ],
                  backgroundColor: ['green', 'red', 'yellow'],
                  borderColor: ['green', 'red', 'yellow'],
                  borderWidth: 1,
                }],
              }}
              options={{ responsive: true, plugins: { title: { display: true, text: 'Peer Mappings Overview' } } }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Notifications Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#333' }}>Notifications</Typography>
        <Box sx={{ maxHeight: 400, overflowY: 'auto', padding: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#ffffff' }}>
          {loading ? (
            <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
          ) : (
            <>
              {/* Individual notifications */}
              {notifications.map(notification => (
                <Box key={notification.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2, borderRadius: 2, backgroundColor: '#f1f1f1' }}>
                  {getProfilePic(notification.senderEmail) ? (
                    <Avatar src={getProfilePic(notification.senderEmail)} sx={{ width: 40, height: 40, marginRight: 2 }} />
                  ) : (
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: '#2196F3', marginRight: 2 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{notification.senderEmail}</Typography>
                    <Typography variant="body2">{notification.message}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', marginTop: 1 }}>{new Date(notification.timestamp).toLocaleString()}</Typography>
                  </Box>
                </Box>
              ))}

              {/* Bulk notifications */}
              <Typography variant="h6" sx={{ marginTop: 3 }}>Bulk Notifications</Typography>
              {bulkNotifications.map(notification => (
                <Box key={notification.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2, borderRadius: 2, backgroundColor: '#e0e0e0' }}>
                  {getProfilePic(notification.senderEmail) ? (
                    <Avatar src={getProfilePic(notification.senderEmail)} sx={{ width: 40, height: 40, marginRight: 2 }} />
                  ) : (
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: '#2196F3', marginRight: 2 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{notification.senderEmail}</Typography>
                    <Typography variant="body2">{notification.message}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', marginTop: 1 }}>{new Date(notification.timestamp).toLocaleString()}</Typography>
                  </Box>
                </Box>
              ))}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
