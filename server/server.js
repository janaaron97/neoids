const express = require('express');
const app = express();
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const cors = require('cors');

// This line is necessary to be able to process POST request data
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client-react/build')));

app.post('/api/save', (req, res) => {
    const { base64String, translation } = req.body;
    console.log(req.body);

    // Generate a unique filename for the image
    const filename = `${translation}.png`;
    // Remove the "data:image/png;base64," part of the Base64 string
    const base64Data = base64String.replace(/^data:image\/png;base64,/, '');
    // Decode the Base64 string into an image
    const imageBuffer = Buffer.from(base64Data, 'base64');
    // Determine the path where the image will be saved
    const imagePath = path.resolve(__dirname, `./images/${filename}`);
    // Write the image to the file system
    fs.writeFileSync(imagePath, imageBuffer);
    // Load the glyphs.json file
    const rawdata = fs.readFileSync(path.resolve(__dirname, './glyphs.json'));
    let glyphs = JSON.parse(rawdata);
    // Add the new glyph to the array
    glyphs.push({ imageUrl: `/images/${filename}`, translation });
    // Write the updated glyphs array back to the glyphs.json file
    fs.writeFileSync(path.resolve(__dirname, './glyphs.json'), JSON.stringify(glyphs, null, 2));
    // Send a success response
    res.sendStatus(200);
  });

  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.get('/api/searchAll', (req, res) => {
    // Load the glyphs.json file
    const rawdata = fs.readFileSync(path.resolve(__dirname, './glyphs.json'));
    const glyphs = JSON.parse(rawdata);
  
    res.json(glyphs);
  });

  app.get('/api/search', (req, res) => {
    const { translation } = req.query;
  
    // Load the glyphs.json file
    const rawdata = fs.readFileSync(path.resolve(__dirname, './glyphs.json'));
    const glyphs = JSON.parse(rawdata);
  
    // Filter the glyphs to only include ones with the specified translation
    console.log(translation);
    var results = glyphs.filter(glyph => glyph.translation == translation.toString().toLowerCase());
    console.log(results);
    // If there are no matching glyphs, return an empty array
    if (!results) {
      results = [];
    }
  
    res.json(results);
  });

  app.get('*', function (req, res) {
    const index = path.join(__dirname, '../client-react/build', 'index.html');
    res.sendFile(index);
  });
  

app.listen(process.env.PORT || 5000)