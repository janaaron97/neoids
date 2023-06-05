const express = require('express');
const app = express();
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const cors = require('cors');

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:process.env.AWS_REGION
});

// This line is necessary to be able to process POST request data
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client-react/build')));

app.post('/api/save', async (req, res) => {
  const { base64String, translation } = req.body;

  // Generate a unique filename for the image
  const filename = `${translation}.png`;

  // Remove the "data:image/png;base64," part of the Base64 string
  const base64Data = base64String.replace(/^data:image\/png;base64,/, '');

  // Decode the Base64 string into an image
  const imageBuffer = Buffer.from(base64Data, 'base64');

  const uploadParams = {
      Bucket: 'neiods',
      Key: filename,
      Body: imageBuffer,
      ContentType: 'image/png',
      ACL: 'public-read'
  };

  try {
      // Upload the image to S3
      const { Location: imageUrl } = await S3.upload(uploadParams).promise();

      // Load the glyphs.json file
      const rawdata = fs.readFileSync(path.resolve(__dirname, './glyphs.json'));
      let glyphs = JSON.parse(rawdata);

      // Add the new glyph to the array
      glyphs.push({ imageUrl, translation });

      // Write the updated glyphs array back to the glyphs.json file
      fs.writeFileSync(path.resolve(__dirname, './glyphs.json'), JSON.stringify(glyphs, null, 2));

      // Send a success response
      res.sendStatus(200);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while saving the image.');
  }
});

  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.get('/api/searchAll', (req, res) => {
    const params = {
      Bucket: 'neiods'
    };
  
    S3.listObjects(params, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Error listing objects in S3 bucket' });
      } else {
        const glyphs = data.Contents.map(item => {
          // Extract the filename without the extension
          const translation = path.parse(item.Key).name;
          return { imageUrl: "https://neiods.s3.us-east-2.amazonaws.com/" + item.Key, translation };
        });
  
        // Sort the glyphs
        glyphs.sort((a, b) => a.translation.localeCompare(b.translation));
  
        res.json(glyphs);
      }
    });
  });

app.get('/api/search', (req, res) => {
  const { translation } = req.query;

  // Load the glyphs.json file
  const rawdata = fs.readFileSync(path.resolve(__dirname, './glyphs.json'));
  const glyphs = JSON.parse(rawdata);

  // Filter the glyphs to only include ones with the specified translation
  var results = glyphs.filter(glyph => glyph.translation == translation.toString().toLowerCase());

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
  

app.listen(3001)
//process.env.PORT || 5000