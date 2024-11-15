import React, { useState } from 'react';
import { Button, Box, Typography, TextField } from '@mui/material';
import { ViewList, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

function LoginDashboard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogin = () => {
    // Handle login functionality (for demo purposes, just log the input)
    console.log("Username:", username, "Password:", password);
    // On successful login, you might want to navigate to a dashboard or home page
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url('https://media.gettyimages.com/id/1167621882/video/two-dimensional-shape-looping-and-changing-colors-in-the-form-of-interconnected-lines.jpg?s=640x640&k=20&c=RSe4-TVN-MVFqbXTBgBhissZpq1kufzd2iL70Ub4EzQ=')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        color: 'white',
      }}
    >
      {/* Top-right Buttons */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ViewList />}
          onClick={() => navigate('/table')} // Navigate to contacts table
          sx={{ borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }}
        >
          View Contacts
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PersonAdd />}
          onClick={() => navigate('/contact')} // Navigate to contact form
          sx={{ borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' }}
        >
          Add Contact
        </Button>
      </Box>

     
    </Box>
  );
}

export default LoginDashboard;
