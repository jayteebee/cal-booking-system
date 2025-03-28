// routes/inventory.js
const express = require('express');
const router = express.Router();
const { getInventoryData, appendInventoryItem, updateInventoryData } = require('../../shared/googleSheets.js');

// GET /api/inventory: Retrieve current inventory from Google Sheets.
router.get('/', async (req, res) => {
  try {
    const inventory = await getInventoryData();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inventory data.' });
  }
});

// POST /api/inventory: Add a new inventory item.
router.post('/', async (req, res) => {
  try {
    const { cameraModel, lensType, quantity, location } = req.body;
    if (!cameraModel || !lensType || !quantity || !location) {
      return res.status(400).json({ error: 'Missing inventory details' });
    }

    // Retrieve current inventory to determine the next ID.
    const inventory = await getInventoryData();
    const ids = inventory.map(i => Number(i.id)).filter(id => !isNaN(id));
    const nextId = ids.length ? Math.max(...ids) + 1 : 1;
    const newItem = {
      id: nextId.toString(),
      cameraModel,
      lensType,
      quantity: quantity.toString(),
      location
    };

    // Append the new item to the sheet.
    await appendInventoryItem(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'Failed to add inventory item.' });
  }
});

// PUT /api/inventory/:id: Update an existing inventory item.
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cameraModel, lensType, quantity, location } = req.body;
    if (!cameraModel && !lensType && !quantity && !location) {
      return res.status(400).json({ error: 'No update fields provided.' });
    }

    // Retrieve current inventory.
    const inventory = await getInventoryData();
    // Find index of the item to update.
    const index = inventory.findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inventory item not found.' });
    }
    // Update the item properties.
    const updatedItem = { ...inventory[index] };
    if (cameraModel) updatedItem.cameraModel = cameraModel;
    if (lensType) updatedItem.lensType = lensType;
    if (quantity) updatedItem.quantity = quantity.toString();
    if (location) updatedItem.location = location;
    // Replace the item in the inventory array.
    inventory[index] = updatedItem;
    // Prepare updated data as a 2D array.
    const updatedData = inventory.map(item => [item.id, item.cameraModel, item.lensType, item.quantity, item.location]);
    await updateInventoryData(updatedData);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item.' });
  }
});

// DELETE /api/inventory/:id: Remove an inventory item.
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Retrieve current inventory.
    const inventory = await getInventoryData();
    // Find index of the item to delete.
    const index = inventory.findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inventory item not found.' });
    }
    // Remove the item from the array.
    const deletedItem = inventory.splice(index, 1)[0];
    // Prepare updated data as a 2D array.
    const updatedData = inventory.map(item => [item.id, item.cameraModel, item.lensType, item.quantity, item.location]);
    await updateInventoryData(updatedData);
    res.json({ message: 'Inventory item deleted', item: deletedItem });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item.' });
  }
});

module.exports = router;
