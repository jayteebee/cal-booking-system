// shared/googleSheets.js
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const SHEET_ID = process.env.SHEET_ID;

// Configure authentication using the service account credentials.
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'), // updated path to credentials.json
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Retrieves inventory data from the "Inventory" sheet.
 * Assumes headers in row 1 (e.g., "id", "cameraModel", "lensType", "quantity", "location").
 */
async function getInventoryData() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Inventory!A1:E',
    });
    const rows = res.data.values;
    if (rows && rows.length) {
      const header = rows[0];
      const data = rows.slice(1).map((row) => {
        let obj = {};
        header.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching inventory from Google Sheets:', error);
    throw error;
  }
}

/**
 * Updates the entire inventory data in the "Inventory" sheet.
 * This function assumes updatedData is a 2D array (rows) matching your sheet’s format.
 */
async function updateInventoryData(updatedData) {
  try {
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'Inventory!A2', // starting from row 2 (assuming row 1 has headers)
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: updatedData,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error updating inventory in Google Sheets:', error);
    throw error;
  }
}

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

/**
 * Logs a booking by appending a row to the "Bookings" sheet.
 * The row format should match your sheet's expected columns.
 */
async function logBooking(bookingDetails) {
  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Bookings!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [Object.values(bookingDetails)],
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error logging booking to Google Sheets:', error);
    throw error;
  }
}

/**
 * Logs an audit event by appending a row to the "AuditLog" sheet.
 */
async function logAudit(actionDescription, admin, details) {
  try {
    const row = [
      new Date().toISOString(),
      actionDescription,
      admin ? admin.username : '',
      JSON.stringify(details),
    ];
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'AuditLog!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error logging audit event to Google Sheets:', error);
    throw error;
  }
}

module.exports = {
  getInventoryData,
  updateInventoryData,
  appendInventoryItem,
  logBooking,
  logAudit,
};
