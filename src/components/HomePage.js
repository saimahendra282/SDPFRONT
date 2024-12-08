import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import { Link } from 'react-scroll';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import logo from './logoSkill.png';
import dashfuck from './dashfu.png';
import ppp from './peermap.png';
import idid from './idid.png';
import bann from './banner.png';
import saipic from './Dashboards/AdminSide/saibeach.png';
import ragpic from './Dashboards/AdminSide/raghu.png';
import vish from './Dashboards/AdminSide/vishal.png';
export default function HomePage() {
    const navigate = useNavigate();
    const handleGetStartedClick = () => {
        navigate('/register');
      };
      const handleLogin = () => {
        navigate('/login');
      };
      const teamMembers = [
        {
          id: 1,
          name: 'Sai Mahendra',
          linkedin: 'https://linkedin.com/in/member1',
          profilePic: `${saipic}`, // Placeholder image
        },
        {
          id: 2,
          name: 'Raghu Ram Reddy',
          linkedin: 'https://linkedin.com/in/member2',
          profilePic: `${ragpic}`, // Placeholder image
        },
        {
          id: 3,
          name: 'Vishal Reddy',
          linkedin: 'https://linkedin.com/in/member3',
          profilePic: `${vish}`, // Placeholder image
        },
      ];
      

  return (
    <>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
        <a href="#" style={{ textDecoration: 'none' }}>
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



          {/* Center Links */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Link
              to="features"
              smooth={true}
              duration={500}
              style={{
                cursor: 'pointer',
                color: '#000',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Features
            </Link>
            <Link
              to="upcoming"
              smooth={true}
              duration={500}
              style={{
                cursor: 'pointer',
                color: '#000',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Upcoming
            </Link>
            <Link
              to="team"
              smooth={true}
              duration={500}
              style={{
                cursor: 'pointer',
                color: '#000',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Our Team
            </Link>
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'flex-end', sm: 'center' }, justifyContent: { xs: 'center', sm: 'flex-end' }, mt: { xs: 2, sm: 0 } }}>
  <Button
    variant="outlined"
    sx={{
      color: '#000',
      borderColor: '#000',
      '&:hover': {
        color: '#fff',
        backgroundColor: '#000',
        borderColor: '#000',
      },
      fontSize: { xs: '0.75rem', sm: '1rem' }, // Adjust font size for smaller screens
    }}
    onClick={handleGetStartedClick}
  >
    Get Started
  </Button>
  <Button
    variant="contained"
    color="primary"
    sx={{
      fontSize: { xs: '0.75rem', sm: '1rem' }, // Adjust font size for smaller screens
    }}
    onClick={handleLogin}
  >
    Login
  </Button>
</Box>

        </Toolbar>
      </AppBar>

      {/* Intro Section */}
      <Container sx={{ paddingY: 5 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Welcome to SkillCert
            </Typography>
            <Typography variant="body1">
              Your go-to platform for certification management and skill development.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
  <Box
    sx={{
      width: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      animation: 'fadeIn 1.5s ease-in-out',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }}
  >
    <img
      src="https://vinsys.com/static/media/training/course/banner/vinsysBannerimage_6LO2cYP.svg"
      alt="Intro Graphic"
      style={{
        width: '100%',
        display: 'block',
        borderRadius: '8px',
      }}
    />
  </Box>
</Grid>

        </Grid>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 4, display: 'block', marginX: 'auto' }}
          onClick={handleGetStartedClick}

        >
          Get Started
        </Button>
      </Container>

      <Box id="features" sx={{ backgroundColor: '#f4f4f4', paddingY: 5, position: 'relative', overflow: 'hidden' }}>
  <Container>
    <Typography variant="h4" gutterBottom align="center" sx={{ color: '#000', marginBottom: 5 }}>
      Here's What We Provide
    </Typography>
    <Box
      sx={{
        display: 'flex',
        animation: 'scrollLeft 15s linear infinite',
        gap: 3,
        '&:hover': {
          animationPlayState: 'paused', // Pause animation on hover
        },
      }}
    >
      {/* Feature 1 */}
      <Box
        sx={{
          flex: '0 0 auto',
          width: '300px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#000',
          backgroundImage:
            `url(${dashfuck})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          padding: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          User-Centered Dashboard
        </Typography>
        <Typography variant="body1">
          A highly intuitive dashboard for managing your certifications.
        </Typography>
      </Box>

      {/* Feature 2 */}
      <Box
        sx={{
          flex: '0 0 auto',
          width: '300px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#000',
          backgroundImage:
            `url(${ppp})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          padding: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Peer Mapping
        </Typography>
        <Typography variant="body1">
          Seamlessly map certifications to peers with ease.
        </Typography>
      </Box>

      {/* Feature 3 */}
      <Box
        sx={{
          flex: '0 0 auto',
          width: '300px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#fff',
          backgroundImage:
            `url(${idid})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          padding: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Personalized ID Card
        </Typography>
        <Typography variant="body1">
          Your professional digital ID card for certifications.
        </Typography>
      </Box>
    </Box>
  </Container>

  {/* Animation Keyframes */}
  <style>
    {`
      @keyframes scrollLeft {
        from {
          transform: translateX(0%);
        }
        to {
          transform: translateX(-100%);
        }
      }
    `}
  </style>
</Box>

      {/* Upcoming Feature Section */}
<Box
  id="upcoming"
  sx={{
    backgroundImage: `url(${bann})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#e8f5e9',
    paddingY: 5,
    borderRadius: 2,
    opacity: 0,
    animation: 'fadeIn 2s ease-in forwards',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  }}
>
  <Container>
    <Typography
      variant="h4"
      gutterBottom
      align="center"
      sx={{
        fontWeight: 'bold',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      }}
    >
      Upcoming Feature: Chatbot
    </Typography>
     
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed rgba(255, 255, 255, 0.8)',
        padding: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Typography
  variant="h6"
  sx={{
    color: 'transparent',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    textFillColor: 'transparent',
    WebkitTextFillColor: 'transparent',
    backgroundImage: 'linear-gradient(90deg, red, yellow)',
    animation: 'glow 2s infinite',
    textShadow: '0 0 8px rgba(255, 0, 0, 0.7), 0 0 16px rgba(255, 255, 0, 0.7)',
  }}
>
  Stay Tuned for Updates!
</Typography>

{/* Keyframes for Glowing Effect */}
<style>
  {`
    @keyframes glow {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `}
</style>

    </Box>
  </Container>

  {/* Keyframes for Fade-in Animation */}
  <style>
    {`
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `}
  </style>
</Box>

     {/* Meet Our Team Section */}
<Box id="team" sx={{ backgroundColor: '#f4f4f4', paddingY: 5 }}>
  <Container>
    <Typography variant="h4" gutterBottom align="center" sx={{ color: '#000' }}>
      Meet Our Team
    </Typography>
    <Grid container spacing={4}>
      {teamMembers.map((member) => (
        <Grid item xs={12} md={4} key={member.id}>
          <Box
            sx={{
              textAlign: 'center',
              border: '1px solid #ddd',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <img
              src={member.profilePic}
              alt={member.name}
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
            <Box sx={{ padding: 2, backgroundColor: '#fff' }}>
              <Typography variant="h6" sx={{ color: '#000' }}>
                {member.name}
              </Typography>
              <IconButton
                component="a"
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#0077B5', marginTop: 1 }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>


      {/* Footer */}
      <Box
        sx={{
          padding: 3,
          marginTop: 5,
        }}
      >
        <Container>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#000' }}>
                Quick Links: About | Contact | Privacy Policy
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} textAlign="right">
              <IconButton>
                <LinkedInIcon sx={{ color: '#000' }} />
              </IconButton>
              <IconButton>
                <GitHubIcon sx={{ color: '#000' }} />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
