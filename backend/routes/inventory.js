// routes/inventory.js
const express = require('express');
const router = express.Router();

// Dummy in-memory inventory array.
// Each item has an id, cameraModel, lensType, quantity, and location.
let inventory = [
  { id: 1, cameraModel: 'A70', lensType: '95', quantity: 5, location: 'Location1' },
  { id: 2, cameraModel: 'A70', lensType: '51', quantity: 3, location: 'Location2' },
];
let nextId = 3;

/**
 * GET /api/inventory
 * Retrieve all inventory items.
 */
router.get('/', (req, res) => {
  res.json(inventory);
});

/**
 * POST /api/inventory
 * Add a new inventory item.
 */
router.post('/', (req, res) => {
  const { cameraModel, lensType, quantity, location } = req.body;
  if (!cameraModel || !lensType || !quantity || !location) {
    return res.status(400).json({ error: 'Missing inventory details' });
  }
  const newItem = { id: nextId++, cameraModel, lensType, quantity, location };
  inventory.push(newItem);
  // Simulate logging the audit event here.
  res.status(201).json(newItem);
});

/**
 * PUT /api/inventory/:id
 * Update an existing inventory item.
 */
router.put('/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const { cameraModel, lensType, quantity, location } = req.body;
  const itemIndex = inventory.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }
  // Update fields if they are provided.
  if (cameraModel !== undefined) inventory[itemIndex].cameraModel = cameraModel;
  if (lensType !== undefined) inventory[itemIndex].lensType = lensType;
  if (quantity !== undefined) inventory[itemIndex].quantity = quantity;
  if (location !== undefined) inventory[itemIndex].location = location;
  // Simulate logging the audit event here.
  res.json(inventory[itemIndex]);
});

/**
 * DELETE /api/inventory/:id
 * Remove an inventory item.
 */
router.delete('/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = inventory.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }
  const deletedItem = inventory.splice(itemIndex, 1);
  // Simulate logging the audit event here.
  res.json({ message: 'Inventory item deleted', item: deletedItem[0] });
});

module.exports = router;
