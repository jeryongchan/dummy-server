const express = require('express');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const app = express();
const port = 3000;

app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'client_consumption_data.csv');
  const jsonData = [];

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('CSV file not found');
    }

    // Read the file and parse its content into JSON
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        jsonData.push(row);
      })
      .on('end', () => {
        res.json(jsonData);
      })
      .on('error', (err) => {
        res.status(500).send('Internal server error');
      });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});