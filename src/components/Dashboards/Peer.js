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
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CertificateIcon from '@mui/icons-material/Assignment';
import VerifyIcon from '@mui/icons-material/Verified';
import RenewalIcon from '@mui/icons-material/Update';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import IdCardIcon from '@mui/icons-material/Badge';
import MyMappedCerti from './PeerSide/MyMappedCerti';
import PeerDashboard from './PeerSide/PeerDashboard';
import AboutDevs from './AdminSide/AboutDevs';
import AdminNotification from './AdminSide/AdminNotification';
import PeerNotify from './PeerSide/PeerNotify';
const Peer = () => {
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

        setUserName(userData.name || 'Peer');
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
    
    { id: 'verifyCertificates', label: 'Verify Certificates', icon: <VerifyIcon /> },
    // { id: 'approveRenewal', label: 'Approve Renewal', icon: <RenewalIcon /> },
    { id: 'sendNotification', label: 'Send Notification', icon: <NotificationsIcon /> },
    { id: 'aboutDevs', label: 'About Devs', icon: <InfoIcon /> },
    { id: 'myIdCard', label: 'My ID Card', icon: <IdCardIcon /> },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <PeerDashboard></PeerDashboard>;
       
      case 'verifyCertificates':
        return <MyMappedCerti> </MyMappedCerti>;
      // case 'approveRenewal':
      //   return <ApproveRenewal></ApproveRenewal>;
      case 'sendNotification':
        return <PeerNotify> </PeerNotify>;
      case 'aboutDevs':
        return <AboutDevs></AboutDevs>;
      case 'myIdCard':
        return <MyId></MyId>;
      default:
        return <Typography>Welcome to the Peer Panel</Typography>;
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage or sessionStorage
    localStorage.clear(); // or sessionStorage.clear();

    // Redirect to login page (or handle logout logic)
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#fff', color: '#000' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Peer Portal
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', transition: 'all 0.3s ease-in-out' },
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2, mt: 8 }}>
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          width: { sm: `calc(100% - 240px)` },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar />
        <Container>{renderContent()}</Container>
      </Box>
    </Box>
  );
};

export default Peer;
