import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { generateUploadURL, listObjects } from './s3.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Calculate the directory name from the current module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to generate a presigned URL for uploading
app.get('/s3Url', async (req, res) => {
  try {
    const url = await generateUploadURL();
    res.json({ url });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).send('Could not generate upload URL');
  }
});

// Endpoint to list objects in the S3 bucket
app.get('/listObjects', async (req, res) => {
  try {
    const objects = await listObjects();
    res.json(objects);
  } catch (error) {
    console.error('Error listing objects:', error);
    res.status(500).send('Could not list objects');
  }
});

// Endpoint to store file metadata (if needed)
app.post('/storeFileData', (req, res) => {
  console.log('File data received:', req.body);
  res.send('File data stored successfully');
});

// Serve the index.html file for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
