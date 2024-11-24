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
          'https://assignment-1-6f4b.onrender.com/api/contactdetails',
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
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Typography variant="h4" align="center" color="text.primary" sx={{ mb: 3 }}>
          Contact Us
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: '100%' }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactForm;
