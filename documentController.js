const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { analyzeDocument } = require('./documentAnalyzer');

const app = express();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.single('document'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Please upload a document.');
  }

  res.send({ message: 'Document uploaded successfully!', filePath: req.file.path });
});

app.get('/analyze/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', fileName);

  fs.exists(filePath, exists => {
    if (!exists) {
      return res.status(404).send('The file does not exist.');
    }

    analyzeDocument(filePath)
      .then(analysisResult => {
        res.json({
          message: 'Analysis complete',
          analysis: analysisResult
        });
      })
      .catch(error => {
        res.status(500).send('An error occurred during the document analysis.');
      });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});