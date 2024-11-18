import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TableSortLabel, Paper, IconButton, Box, TextField, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Typography, Tooltip
} from '@mui/material';
import { Edit, Delete, ContactMail, Call } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContactsTable() {
  const [contacts, setContacts] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editContact, setEditContact] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/contactdetails');
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditOpen = (contact) => {
    setEditContact(contact);
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditContact(null);
    setOpen(false);
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/contactdetails/${editContact._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editContact)
      });
      if (response.ok) {
        setContacts((prevContacts) => prevContacts.map((contact) => (contact._id === editContact._id ? editContact : contact)));
        toast.success('Contact updated successfully!', { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
    handleEditClose();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://assignment-1-6f4b.onrender.com/api/contactdetails/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setContacts(contacts.filter(contact => contact._id !== id));
        toast.success('Contact deleted successfully!', { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const sortedContacts = contacts.sort((a, b) => {
    if (orderBy === 'firstName') {
      return order === 'asc'
        ? a.firstName.localeCompare(b.firstName)
        : b.firstName.localeCompare(a.firstName);
    }
    return 0;
  });

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, contacts.length - page * rowsPerPage);

  return (
    <Box
      sx={{
        maxWidth: '100%',
        marginTop: '20px',
        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD0UXI_X9MW7oCjOY5urbZ8ySF5CNoUuLcIQ&s')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        padding: 4,
        borderRadius: 2,
        color: '#ffffff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      <ToastContainer />
      <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 2, color: '#333', fontSize: '28px' }}>
          Contacts Table
        </Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {['First Name', 'Last Name', 'Email', 'Phone Number', 'Company', 'Job Title', 'Actions'].map((headCell, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: 'bold',
                      color: '#333',
                      borderBottom: '2px solid black',
                      fontSize: '16px',
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.replace(' ', '').toLowerCase()}
                      direction={orderBy === headCell.replace(' ', '').toLowerCase() ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.replace(' ', '').toLowerCase())}
                    >
                      {headCell}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
                <TableRow
                  key={contact._id}
                  hover
                  sx={{
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                  }}
                >
                  <TableCell sx={{ borderBottom: '1px solid #ccc' }}>{contact.firstName}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #ccc' }}>{contact.lastName}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #ccc' }}>{contact.email}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #ccc' }}>{contact.phone}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #ccc' }}>{contact.company}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #ccc' }}>{contact.jobTitle}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #ccc' }}>
                    <Tooltip title="Edit Contact" arrow>
                      <IconButton color="primary" onClick={() => handleEditOpen(contact)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Contact" arrow>
                      <IconButton color="error" onClick={() => handleDelete(contact._id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {editContact && (
        <Dialog open={open} onClose={handleEditClose}>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              fullWidth
              variant="outlined"
              value={editContact.firstName}
              onChange={(e) => setEditContact({ ...editContact, firstName: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              variant="outlined"
              value={editContact.lastName}
              onChange={(e) => setEditContact({ ...editContact, lastName: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              variant="outlined"
              value={editContact.email}
              onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              variant="outlined"
              value={editContact.phone}
              onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Company"
              fullWidth
              variant="outlined"
              value={editContact.company}
              onChange={(e) => setEditContact({ ...editContact, company: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Job Title"
              fullWidth
              variant="outlined"
              value={editContact.jobTitle}
              onChange={(e) => setEditContact({ ...editContact, jobTitle: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">Cancel</Button>
            <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default ContactsTable;
