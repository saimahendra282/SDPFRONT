import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  CssBaseline,
  Container,
} from '@mui/material';
import MyId from './MyId';
 import AdminDashboard from './AdminSide/AdminDashboard';
import MapToPeer from './AdminSide/MapToPeer';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import CertIcon from '@mui/icons-material/Assignment';
import AboutDevs from './AdminSide/AboutDevs';
import ManagePeer from './AdminSide/ManagePeer';
import ManageUser from './AdminSide/ManageUser';
import UploadCertificate from './UserSide/UploadCertificate';
import TrackCerti from './AdminSide/TrackCerti';
import AdminNotification from './AdminSide/AdminNotification';
const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [userName, setUserName] = useState('Loading...');
  const [profilePic, setProfilePic] = useState('/static/images/avatar.png');

  // Fetch user profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('jwtToken'); // Assuming token is stored in localStorage
      if (!token) {
        console.error('No JWT token found');
        return;
      }
  
      try {
        const response = await fetch('https://microservice1-production.up.railway.app/api/users/get-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
  
        if (!response.ok) {
          console.error('Failed to fetch user profile');
          alert('Failed to fetch user profile');
          return;
        }
  
        const userData = await response.json();
  
        // Debugging: print the received user data
        console.log('User data retrieved:', userData);
  
        setUserName(userData.name || 'User');
        setProfilePic(userData.profilePic || '/static/images/avatar.png'); // Use profilePic instead of profile_pic
  
        // Debugging: print the updated profile details
        console.log('User Name:', userData.name);
        console.log('Profile Picture:', userData.profilePic); // Print the correct field
      } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('An error occurred while fetching your profile.');
      }
    };
  
    fetchUserProfile();
  }, []);
  

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'managePeer', label: 'Manage Peer', icon: <PeopleIcon /> },
    { id: 'manageUsers', label: 'Manage Users', icon: <PeopleIcon /> },
    { id: 'mapToPeer', label: 'Map to Peer', icon: <MapIcon /> },
    { id: 'trackCertifications', label: 'Track Certifications', icon: <CertIcon /> },
    // { id: 'manageCertifications', label: 'Manage Certifications', icon: <CertIcon /> },
    { id: 'sendNotification', label: 'Send Notification', icon: <NotificationsIcon /> },
    { id: 'aboutDevs', label: 'About Devs', icon: <InfoIcon /> },
    { id: 'profile', label: 'My ID Card', icon: <PeopleIcon /> },
  ];

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  
  const handleTabClick = (tabId) => setSelectedTab(tabId);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Clear the JWT token on logout
    window.location.href = '/login'; // Redirect to login
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <AdminDashboard></AdminDashboard>;
      case 'managePeer':
        return <ManagePeer> </ManagePeer>;
      case 'manageUsers':
        return <ManageUser></ManageUser>;
      case 'mapToPeer':
        return <MapToPeer> </MapToPeer>;
      case 'trackCertifications':
        return <TrackCerti>
           </TrackCerti>;
      // case 'manageCertifications':
      //   return <Typography>Manage certification  Content</Typography>;
      case 'sendNotification':
        return <AdminNotification></AdminNotification>;
      case 'aboutDevs':
        return <AboutDevs />;
      case 'profile':
        return <MyId></MyId>;
      default:
        return <Typography>Welcome to the Admin Panel</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#333' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>Admin Portal</Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', transition: 'all 0.3s ease-in-out', marginTop: '64px' }}}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Avatar alt={userName} src={profilePic} sx={{ width: 80, height: 80, margin: '0 auto 10px auto' }} />
          <Typography variant="h6">{userName}</Typography>
        </Box>
        <List>
          {tabs.map((tab) => (
            <ListItem button key={tab.id} onClick={() => handleTabClick(tab.id)}>
              <ListItemIcon>{tab.icon}</ListItemIcon>
              <ListItemText primary={tab.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', width: { sm: `calc(100% - 240px)` } }}>
        <Container>{renderContent()}</Container>
      </Box>
    </Box>
  );
};

export default Admin;
