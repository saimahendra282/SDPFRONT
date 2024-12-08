import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid, TextField, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logg from './log.png';
import logo from './logoSkill.png';
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://microservice1-production.up.railway.app/api/users/login', {
        email,
        password,
      });
  
      if (response.status === 200) {
        const { token, role } = response.data;
  console.log("Settin up the data...");
        // Save token and role in localStorage
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('UserEmail',email);
  
        // Set Authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log("Navigating to dashboards")
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'peer') {
          navigate('/peer');
        } else if (role === 'user') {
          navigate('/user');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials or an error occurred.');
    }
  };
  
  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#333' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
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
    <Typography variant="h6" component="div" sx={{ color: '#fff' }}>
      SKILLCERT
    </Typography>
  </Box>
</a>

         
          <Button
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: '#fff',
              '&:hover': { color: '#333', backgroundColor: '#fff' },
            }}
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ paddingY: 5 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Log in to access your certifications and skill records.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ padding: 4, boxShadow: 2, borderRadius: 2 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Login to SkillCert
              </Typography>
              {error && (
                <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
                  {error}
                </Typography>
              )}
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ marginBottom: 3 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginBottom: 3 }}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  sx={{ paddingY: 1.5 }}
                >
                  Login
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
        {/* Image section below the text */}
        <Grid container spacing={4} alignItems="center" >
          <Grid item xs={12} md={6}>
            {/* Image with transition */}
            <Box
              sx={{
                opacity: 1,
                transform: 'translateY(20px)',
                transition: 'all 0.5s ease-out',
                 
                marginTop: 1,
              }}
            >
              <img
                src={logg} // Replace with your image URL
                alt="Login Illustration"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
