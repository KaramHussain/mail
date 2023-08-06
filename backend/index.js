const express = require('express');
const AWS = require('aws-sdk');
const fileUpload = require('express-fileupload');
const cors = require('cors'); 
const app = express();

AWS.config.update({
  accessKeyId: 'AKIAVYZ7WJBZM6WKAW4U', 
  secretAccessKey: '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', 
  region: 'us-east-1', 
});

const s3 = new AWS.S3();

// Middleware for handling file uploads
app.use(fileUpload());
app.use(cors()); // Enable CORS for all routes

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.files.file;

  
  const params = {
    Body: file.data,
    Bucket: 'vijayagopu', // Replace with your S3 bucket name
    Key:file.name, // Replace with the desired S3 key for the uploaded file
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Error uploading file to S3' });
    }

    console.log('File uploaded successfully.');
    const s3Link = data.Location;
    return res.json({ s3Link }); // Send the S3 link back to the frontend
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
