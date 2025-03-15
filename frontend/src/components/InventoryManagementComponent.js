// src/components/InventoryManagementComponent.js
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function InventoryManagementComponent() {
  const [inventory, setInventory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentItem, setCurrentItem] = useState({
    cameraModel: '',
    lensType: '',
    quantity: '',
    location: '',
  });

  // Fetch inventory from backend
  const fetchInventory = () => {
    fetch('http://localhost:5001/api/inventory')
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error('Error fetching inventory:', err));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDialogOpen = (mode, item = { cameraModel: '', lensType: '', quantity: '', location: '' }) => {
    setDialogMode(mode);
    setCurrentItem(mode === 'edit' ? item : { cameraModel: '', lensType: '', quantity: '', location: '' });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentItem({ cameraModel: '', lensType: '', quantity: '', location: '' });
  };

  const handleSave = () => {
    if (dialogMode === 'add') {
      fetch('http://localhost:5001/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem),
      })
        .then((res) => res.json())
        .then(() => {
          fetchInventory();
          handleDialogClose();
        })
        .catch((err) => console.error('Error adding inventory:', err));
    } else if (dialogMode === 'edit') {
      fetch(`http://localhost:5001/api/inventory/${currentItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem),
      })
        .then((res) => res.json())
        .then(() => {
          fetchInventory();
          handleDialogClose();
        })
        .catch((err) => console.error('Error updating inventory:', err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      fetch(`http://localhost:5001/api/inventory/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => fetchInventory())
        .catch((err) => console.error('Error deleting inventory:', err));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({ ...prev, [name]: value }));
  };

  // Helper: return color based on quantity
  const getStockColor = (quantity) => {
    if (quantity < 3) return 'red';
    if (quantity < 10) return 'orange';
    return 'green';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Inventory Management</Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen('add')}>
        Add New Inventory Item
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Camera Model</TableCell>
              <TableCell>Lens Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.cameraModel}</TableCell>
                <TableCell>{item.lensType}</TableCell>
                <TableCell sx={{ color: getStockColor(item.quantity) }}>{item.quantity}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleDialogOpen('edit', item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{dialogMode === 'add' ? 'Add New Inventory Item' : 'Edit Inventory Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="cameraModel"
            label="Camera Model"
            fullWidth
            variant="standard"
            value={currentItem.cameraModel}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="lensType"
            label="Lens Type"
            fullWidth
            variant="standard"
            value={currentItem.lensType}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={currentItem.quantity}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            variant="standard"
            value={currentItem.location}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave}>{dialogMode === 'add' ? 'Add' : 'Update'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InventoryManagementComponent;
