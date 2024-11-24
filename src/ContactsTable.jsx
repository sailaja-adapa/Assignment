import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TableSortLabel, Paper, IconButton, Box, TextField, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Typography, Tooltip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ContactsTable() {
  const [contacts, setContacts] = useState([]); // Always start with an empty array
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editContact, setEditContact] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('https://assignment-1-6f4b.onrender.com/api/contactdetails');
        
        // Check if the response is ok
        if (!response.ok) {
          // If the response is 404, handle it separately
          if (response.status === 404) {
            toast.error('API not found. Please check the endpoint.', { position: "top-center", autoClose: 2000 });
          } else {
            toast.error(`Unexpected error: ${response.statusText}`, { position: "top-center", autoClose: 2000 });
          }
          return;
        }
        
        const data = await response.json();
        
        // Ensure the data is an array before using it
        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          toast.error('Invalid data format received', { position: "top-center", autoClose: 2000 });
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast.error('Failed to fetch contacts', { position: "top-center", autoClose: 2000 });
      }
    };
  
    fetchContacts();
  }, []);
   // Empty dependency array ensures the data is fetched only once on component mount

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
    setPage(0); // Reset to page 0 when rows per page change
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
      const response = await fetch(`https://assignment-1-6f4b.onrender.com/api/contactdetails/${editContact._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editContact),
      });
      if (response.ok) {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === editContact._id ? editContact : contact
          )
        );
        toast.success('Contact updated successfully!', { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact', { position: "top-center", autoClose: 2000 });
    }
    handleEditClose();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://assignment-1-6f4b.onrender.com/api/contactdetails/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== id)
        );
        toast.success('Contact deleted successfully!', { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact', { position: "top-center", autoClose: 2000 });
    }
  };

  const sortedContacts = Array.isArray(contacts) ? contacts.slice().sort((a, b) => {
    const fieldA = a[orderBy]?.toLowerCase?.() || '';
    const fieldB = b[orderBy]?.toLowerCase?.() || '';
    return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
  }) : [];

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, contacts.length - page * rowsPerPage);

  return (
    <Box sx={{ maxWidth: '100%', mt: 3, px: 4 }}>
      <ToastContainer />
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          Contacts Table
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['firstName', 'lastName', 'email', 'phone', 'company', 'jobTitle'].map((field, index) => (
                  <TableCell key={index}>
                    <TableSortLabel
                      active={orderBy === field}
                      direction={orderBy === field ? order : 'asc'}
                      onClick={() => handleRequestSort(field)}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.jobTitle}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditOpen(contact)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(contact._id)}>
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

      <Dialog open={open} onClose={handleEditClose}>
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent>
          {['firstName', 'lastName', 'email', 'phone', 'company', 'jobTitle'].map((field, index) => (
            <TextField
              key={index}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              margin="dense"
              value={editContact?.[field] || ''}
              onChange={(e) =>
                setEditContact({ ...editContact, [field]: e.target.value })
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContactsTable;
