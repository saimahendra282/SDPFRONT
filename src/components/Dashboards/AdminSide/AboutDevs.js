import React from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import raghuimg from './raghu.png'; // Import Raghu's image
import vishalimg from './vishal.png'; // Import Vishal's image
import saiMahendraImg from './saibeach.png'; // Import Sai Mahendra's image

const AboutDevs = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Meet the Developers
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* Developer 1: Sai Mahendra */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
            <img
              src={saiMahendraImg} // Sai Mahendra's image
              alt="Sai Mahendra profile"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" component="div" align="center" gutterBottom>
                Sai Mahendra
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  href="https://www.linkedin.com/in/bejawada-sai-mahendra-b18289212"
                  target="_blank"
                  startIcon={<LinkedInIcon />}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  href="https://github.com/saimahendra282"
                  target="_blank"
                  startIcon={<GitHubIcon />}
                >
                  GitHub
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Developer 2: Raghu Ram Reddy */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
            <img
              src={raghuimg} // Raghu's image
              alt="Raghu Ram Reddy profile"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" component="div" align="center" gutterBottom>
                Raghu Ram Reddy
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  href="https://www.linkedin.com/in/raghu-ram-reddy-dondeti-827559247/"
                  target="_blank"
                  startIcon={<LinkedInIcon />}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  href="https://github.com/janesmith"
                  target="_blank"
                  startIcon={<GitHubIcon />}
                >
                  GitHub
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Developer 3: Vishal Reddy */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
            <img
              src={vishalimg} // Vishal's image
              alt="Vishal Reddy profile"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" component="div" align="center" gutterBottom>
                Vishal Reddy
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  href="https://www.linkedin.com/in/markjohnson"
                  target="_blank"
                  startIcon={<LinkedInIcon />}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  href="https://github.com/markjohnson"
                  target="_blank"
                  startIcon={<GitHubIcon />}
                >
                  GitHub
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutDevs;
