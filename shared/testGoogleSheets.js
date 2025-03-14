// testGoogleSheets.js
const { getInventoryData, updateInventoryData, logBooking, logAudit } = require('./googleSheets.js');

async function runTests() {
  console.log(await getInventoryData());
  console.log(await updateInventoryData({ sample: 'data' }));
  console.log(await logBooking({ id: 1, date: '2025-04-20' }));
  console.log(await logAudit('Test action', { username: 'admin' }, { detail: 'testing' }));
}

runTests();
