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
  InputAdornment,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios'; // To handle file upload

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    name: '',
    phone: '',
    profilePic: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); // For handling file picker

  // Fetch users list on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No JWT token found. Please log in.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://microservice1-production.up.railway.app/api/users/adminusers', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users. Please try again later.');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`https://microservice1-production.up.railway.app/api/users/delete-user?email=${selectedUser}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user. Please try again later.');
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.email !== selectedUser));
      setOpenDialog(false);
      setSelectedUser(null);
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
  
      try {
        const cloudinaryResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dhgjbv5bu/image/upload',
          formData
        );
        profilePicUrl = cloudinaryResponse.data.secure_url;
      } catch (error) {
        setError('Failed to upload profile picture. Please try again.');
        return;
      }
    }
  
    try {
      // Send PUT request with email in query string and updated user data in body
      const response = await fetch(`https://microservice1-production.up.railway.app/api/users/update-user?email=${editForm.email}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone,
          profilePic: profilePicUrl,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user. Please try again later.');
      }
  
      // Update UI with new data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === editForm.email
            ? { ...user, name: editForm.name, phone: editForm.phone, profilePic: profilePicUrl }
            : user
        )
      );
      setOpenEditDialog(false);
      setEditForm({ email: '', name: '', phone: '', profilePic: '' });
      setSelectedFile(null); // Reset selected file
    } catch (error) {
      setError(error.message);
    }
  };
  

  const openEditForm = (user) => {
    setEditForm(user);
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
        Manage Users
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {users.map((user) => (
          <Grid item key={user.email} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345, position: 'relative' }}>
              <CardMedia
                component="img"
                height="140"
                image={user.profilePic || '/default-avatar.png'}
                alt={user.name}
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
                onClick={() => openEditForm(user)}
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
                  setSelectedUser(user.email);
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
                  <b>{user.name}</b>
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                  <b>Email:</b> {user.email}
                </Typography>
                <Typography variant="body2">
                  <b>Phone:</b> {user.phone || 'N/A'}
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
          setSelectedUser(null);
        }}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user with email <b>{selectedUser}</b>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
        <DialogTitle>Edit User</DialogTitle>
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
            label="Phone"
            fullWidth
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
          <TextField
            label="Email"
            value={editForm.email} // The email value should be pre-filled and non-editable
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
          <Box sx={{ marginTop: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outlined" component="span" fullWidth>
                Upload Profile Picture
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUser;
