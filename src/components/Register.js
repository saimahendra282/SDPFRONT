import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import logo from './logoSkill.png';
import { styled } from '@mui/system';
import reg from './regi.png';
const FileInput = styled('input')({
  display: 'none',
});

export default function Register() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };

  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePic: '',  // Store the URL here
    dept: '',
    password: '',
  });
  const [preview, setPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Upload image to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'sample'); // Add your upload preset here
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dhgjbv5bu/image/upload`, // Replace with your Cloudinary cloud name
          {
            method: 'POST',
            body: uploadData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          setFormData((prevData) => ({
            ...prevData,
            profilePic: data.secure_url, // Update only the profilePic field
          }));
          setPreview(data.secure_url); // Set the image preview URL
        } else {
          console.error('Error: No URL returned from Cloudinary', data);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  const validateForm = () => {
    const { name, email, phone, password } = formData;
  
    // Validate name (minimum 3 characters, no numbers or special characters)
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    if (!nameRegex.test(name)) {
      setSnackbar({ open: true, message: 'Name must be at least 3 characters long and contain only letters.', severity: 'error' });
      return false;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbar({ open: true, message: 'Invalid email format.', severity: 'error' });
      return false;
    }
  
    // Validate phone number format (assumes international numbers or 10 digits)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setSnackbar({ open: true, message: 'Invalid phone number format.', severity: 'error' });
      return false;
    }
  
    // Validate password (minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    if (!passwordRegex.test(password)) {
      setSnackbar({ 
        open: true, 
        message: 'Password must be at least 5 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.', 
        severity: 'error' 
      });
      return false;
    }
  
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: selectedRole,
      dept: selectedRole === 'peer' ? formData.dept : null,
      profilePic: formData.profilePic, // Now it's the Cloudinary URL
    };
  
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://microservice1-production.up.railway.app';
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSnackbar({ open: true, message: response.data, severity: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error during registration', error);
      const errorMsg = error.response?.data || 'Error during registration. Please try again.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container sx={{ paddingY: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
      <a href="/" style={{ textDecoration: 'none' }}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {/* Circular Logo Image */}
    <img
      src={logo} // Replace with your logo URL
      alt="SkillCert Logo"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
      }}
    />
    {/* Logo Text */}
    <Typography variant="h6" component="div" sx={{ color: '#000' }}>
      SKILLCERT
    </Typography>
  </Box>
</a>

        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center', marginBottom: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Create and Get Certified
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Take your skills to the next level by registering as a Peer or User. Admins can contact us directly to get started!
            </Typography>
            {/* Image below the description with hover and slide-in effect */}
            <Box
  sx={{
    marginTop: 4,
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    '&:hover': {
      transform: 'scale(1.1)',
      transition: 'all 0.3s ease-in-out',
    },
    '& img': {
      width: '60%',
      height: 'auto',
      borderRadius: '8px',
      transform: 'translateX(0)',
      transition: 'transform 0.5s ease-out',
    },
  }}
>
  <img
    src={reg}
    alt="Registration"
    style={{ transform: 'translateX(0)' }}
  />
</Box>

          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: 4,
              borderRadius: 3,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
              maxWidth: 600,
              marginX: 'auto',
            }}
          >
            <Typography variant="h4" align="center" sx={{ marginBottom: 4 }}>
              Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Name" variant="outlined" required name="name" value={formData.name} onChange={handleChange} />
              <TextField label="Email" variant="outlined" required type="email" name="email" value={formData.email} onChange={handleChange} />
              <TextField label="Phone Number" variant="outlined" required type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              <TextField label="Password" variant="outlined" required type="password" name="password" value={formData.password} onChange={handleChange} />
              <Box>
                <FileInput accept="image/*" id="upload-profile-pic" type="file" onChange={handleFileChange} />
                <label htmlFor="upload-profile-pic">
                  <Button variant="outlined" color="primary" component="span" sx={{ width: '100%' }}>
                    Upload Profile Picture
                  </Button>
                </label>
                {preview && <img src={preview} alt="Profile Preview" style={{ width: '100px', height: '100px', marginTop: '10px' }} />}
              </Box>
              <FormControl fullWidth required>
                <InputLabel>Interested As</InputLabel>
                <Select name="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="peer">Peer</MenuItem>
                </Select>
              </FormControl>

              {selectedRole === 'peer' && (
                <TextField
                  label="Dept/Area of Specialization"
                  variant="outlined"
                  required
                  name="dept"
                  value={formData.dept}
                  onChange={handleChange}
                />
              )}

              <Button variant="contained" color="primary" type="submit" disabled={!selectedRole}>
                Submit
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
