// // routes/inventory.js
// const express = require('express');
// const router = express.Router();

// // Dummy in-memory inventory array.
// // Each item has an id, cameraModel, lensType, quantity, and location.
// let inventory = [
//   { id: 1, cameraModel: 'A70', lensType: '95', quantity: 50, location: 'Location1' },
//   { id: 2, cameraModel: 'A70', lensType: '51', quantity: 30, location: 'Location2' },
// ];
// let nextId = 3;

// /**
//  * GET /api/inventory
//  * Retrieve all inventory items.
//  */
// router.get('/', (req, res) => {
//   res.json(inventory);
// });

// /**
//  * POST /api/inventory
//  * Add a new inventory item.
//  */
// router.post('/', (req, res) => {
//   const { cameraModel, lensType, quantity, location } = req.body;
//   if (!cameraModel || !lensType || !quantity || !location) {
//     return res.status(400).json({ error: 'Missing inventory details' });
//   }
//   const newItem = { id: nextId++, cameraModel, lensType, quantity, location };
//   inventory.push(newItem);
//   // Simulate logging the audit event here.
//   res.status(201).json(newItem);
// });

// /**
//  * PUT /api/inventory/:id
//  * Update an existing inventory item.
//  */
// router.put('/:id', (req, res) => {
//   const itemId = parseInt(req.params.id);
//   const { cameraModel, lensType, quantity, location } = req.body;
//   const itemIndex = inventory.findIndex(item => item.id === itemId);
//   if (itemIndex === -1) {
//     return res.status(404).json({ error: 'Inventory item not found' });
//   }
//   // Update fields if they are provided.
//   if (cameraModel !== undefined) inventory[itemIndex].cameraModel = cameraModel;
//   if (lensType !== undefined) inventory[itemIndex].lensType = lensType;
//   if (quantity !== undefined) inventory[itemIndex].quantity = quantity;
//   if (location !== undefined) inventory[itemIndex].location = location;
//   // Simulate logging the audit event here.
//   res.json(inventory[itemIndex]);
// });

// /**
//  * DELETE /api/inventory/:id
//  * Remove an inventory item.
//  */
// router.delete('/:id', (req, res) => {
//   const itemId = parseInt(req.params.id);
//   const itemIndex = inventory.findIndex(item => item.id === itemId);
//   if (itemIndex === -1) {
//     return res.status(404).json({ error: 'Inventory item not found' });
//   }
//   const deletedItem = inventory.splice(itemIndex, 1);
//   // Simulate logging the audit event here.
//   res.json({ message: 'Inventory item deleted', item: deletedItem[0] });
// });

// module.exports = router;

// routes/inventory.js
const express = require('express');
const router = express.Router();
const { getInventoryData, updateInventoryData } = require('../../shared/googleSheets.js');

// GET /api/inventory: Retrieve current inventory from Google Sheets.
router.get('/', async (req, res) => {
  try {
    const inventory = await getInventoryData();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inventory data.' });
  }
});

// // POST /api/inventory: Add a new inventory item.
// router.post('/', async (req, res) => {
//   // For example, retrieve current inventory, append the new item, then update the sheet.
//   try {
//     const { cameraModel, lensType, quantity, location } = req.body;
//     if (!cameraModel || !lensType || !quantity || !location) {
//       return res.status(400).json({ error: 'Missing inventory details' });
//     }
//     const inventory = await getInventoryData();
//     // Assume 'id' is auto-incremented; calculate next id.
//     const nextId = inventory.length ? Math.max(...inventory.map(i => Number(i.id) || 0)) + 1 : 1;
//     const newItem = { id: nextId.toString(), cameraModel, lensType, quantity: quantity.toString(), location };
//     // Append new item to existing inventory data.
//     const updatedData = inventory.map(item => [item.id, item.cameraModel, item.lensType, item.quantity, item.location]);
//     updatedData.push([newItem.id, newItem.cameraModel, newItem.lensType, newItem.quantity, newItem.location]);
//     await updateInventoryData(updatedData);
//     res.status(201).json(newItem);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add inventory item.' });
//   }
// });

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
    console.log('Next ID:', nextId);
    const newItem = {
      id: nextId.toString(),
      cameraModel,
      lensType,
      quantity: quantity.toString(),
      location
    };
    // Append the new item instead of updating the entire sheet.
    await appendInventoryItem(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ error: 'Failed to add inventory item.' });
  }
});

/**
 * Appends a new inventory item to the "Inventory" sheet.
 * Expects newItem to be an object with properties: id, cameraModel, lensType, quantity, location.
 */
async function appendInventoryItem(newItem) {
  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Inventory!A2:E', // Append starting after the header row
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[newItem.id, newItem.cameraModel, newItem.lensType, newItem.quantity, newItem.location]],
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error appending inventory item to Google Sheets:', error);
    throw error;
  }
}

// Similar changes for PUT and DELETE endpoints
// For PUT, find the row that matches req.params.id, update the fields, and then update the sheet.
// For DELETE, remove the row corresponding to req.params.id and update the sheet.

module.exports = {
  getInventoryData,
  updateInventoryData,
  appendInventoryItem,
};

