import React, { useState } from 'react';
import axios from 'axios';
import { Box, Grid, TextField, Button, Typography, Paper, Snackbar, Alert } from '@mui/material';

function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
  });

  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, company, jobTitle } = formData;

    if (firstName && lastName && email && phone && company && jobTitle) {
      try {
        // Send data to backend using axios
        const response = await axios.post(
          'http://assignment-1-6f4b.onrender.com/api/contactdetails',
          formData,
          { headers: { 'Content-Type': 'application/json' } }
        );

        setToast({ open: true, severity: 'success', message: 'Details submitted successfully!' });
        setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '' });
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred, please try again later.';
        setToast({ open: true, severity: 'error', message: errorMessage });
      }
    } else {
      setToast({ open: true, severity: 'error', message: 'Please fill in all fields.' });
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f5f5f5',
        backgroundImage: 'url(https://img.freepik.com/free-photo/vintage-pink-telephone-composition_23-2148913955.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          maxWidth: 600,
          width: '90%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 4,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          marginLeft: '90px',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0px 0px 20px 8px rgba(255, 255, 255, 0.6)',
          },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 600,
            color: '#333',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Contact Form
        </Typography>
        
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company"
                variant="outlined"
                required
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                variant="outlined"
                required
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ px: 4, py: 1 }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{
              width: '100%',
              fontSize: '1rem',
              fontWeight: 500,
              backgroundColor: toast.severity === 'success' ? '#4caf50' : '#f44336',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default ContactForm;
