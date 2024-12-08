import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  Box,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios'; // To handle file upload

const ManagePeer = () => {
  const [peers, setPeers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    name: '',
    phone: '',
    profilePic: '',
    dept: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); // For handling file picker

  // Fetch peers list on mount
  useEffect(() => {
    const fetchPeers = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No JWT token found. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://microservice1-production.up.railway.app/api/users/peers', { // Adjust the API endpoint for peers
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch peers. Please try again later.');
        }

        const data = await response.json();
        setPeers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeers();
  }, []);

  const handleDelete = async () => {
    if (!selectedPeer) return;

    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`https://microservice1-production.up.railway.app/api/users/delete-peer?email=${selectedPeer}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete peer. Please try again later.');
      }

      setPeers((prevPeers) => prevPeers.filter((peer) => peer.email !== selectedPeer));
      setOpenDialog(false);
      setSelectedPeer(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditSubmit = async () => {
    const token = localStorage.getItem('jwtToken');
  
    // Handle file upload to Cloudinary if a new file is selected
    let profilePicUrl = editForm.profilePic;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'sample'); // Set your Cloudinary upload preset
      const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_URL;

      try {
        const cloudinaryResponse = await axios.post(
          cloudinaryUrl,
          formData
        );
        profilePicUrl = cloudinaryResponse.data.secure_url;
      } catch (error) {
        setError('Failed to upload profile picture. Please try again.');
        return;
      }
    }
  
    try {
      // Send PUT request with email in query string and updated peer data in body
      const response = await fetch(`https://microservice1-production.up.railway.app/api/users/update-peer?email=${editForm.email}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone,
          profilePic: profilePicUrl,
          dept: editForm.dept, // Include department for peers
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update peer. Please try again later.');
      }
  
      // Update UI with new data
      setPeers((prevPeers) =>
        prevPeers.map((peer) =>
          peer.email === editForm.email
            ? { ...peer, name: editForm.name, phone: editForm.phone, profilePic: profilePicUrl, dept: editForm.dept }
            : peer
        )
      );
      setOpenEditDialog(false);
      setEditForm({ email: '', name: '', phone: '', profilePic: '', dept: '' });
      setSelectedFile(null); // Reset selected file
    } catch (error) {
      setError(error.message);
    }
  };

  const openEditForm = (peer) => {
    setEditForm(peer);
    setOpenEditDialog(true);
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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Manage Peers
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {peers.map((peer) => (
          <Grid item key={peer.email} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345, position: 'relative' }}>
              <CardMedia
                component="img"
                height="140"
                image={peer.profilePic || '/default-avatar.png'}
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
                onClick={() => openEditForm(peer)}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 50,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => {
                  setSelectedPeer(peer.email);
                  setOpenDialog(true);
                }}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(255, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                  },
                }}
              >
                <Delete />
              </IconButton>
              <CardContent>
                <Typography variant="h6" align="center">
                  <b>{peer.name}</b>
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                  <b>Email:</b> {peer.email}
                </Typography>
                <Typography variant="body2">
                  <b>Phone:</b> {peer.phone || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <b>Department:</b> {peer.dept || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedPeer(null);
        }}
      >
        <DialogTitle>Delete Peer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the peer with email <b>{selectedPeer}</b>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Peer Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
        <DialogTitle>Edit Peer</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Name"
            fullWidth
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Email"
            fullWidth
            value={editForm.email}
            disabled
          />
          <TextField
            margin="normal"
            label="Phone"
            fullWidth
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Department"
            fullWidth
            value={editForm.dept}
            onChange={(e) => setEditForm({ ...editForm, dept: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagePeer;
