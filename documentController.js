const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { analyzeDocumentContent } = require('./documentAnalyzer');

const app = express();

const uploadStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const documentUploader = multer({ storage: uploadStorageConfig });

app.use(express.static('public'));

app.post('/upload', documentUploader.single('document'), (req, res) => {
  const uploadedDocument = req.file;
  if (!uploadedDocument) {
    return res.status(400).send('Please upload a document.');
  }

  res.send({ message: 'Document uploaded successfully!', filePath: req.file.path });
});

app.get('/analyze/:fileName', (req, res) => {
  const fileNameRequested = req.params.fileName;
  const fullPathToRequestedDocument = path.join(__dirname, 'uploads', fileNameRequested);

  fs.exists(fullPathToRequestedDocument, doesExist => {
    if (!doesExist) {
      return res.status(404).send('The file does not exist.');
    }

    analyzeDocumentContent(fullPathToRequestedDocument)
      .then(analysisResults => {
        res.json({
          message: 'Analysis complete',
          analysis: analysisResults
        });
      })
      .catch(error => {
        res.status(500).send('An error occurred during the document analysis.');
      });
  });
});

const applicationPort = process.env.PORT || 3000;
app.listen(applicationPort, () => {
  console.log(`Server is running on port ${applicationPort}`);
});