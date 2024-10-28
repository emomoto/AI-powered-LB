const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { analyzeDocumentContent } = require('./documentAnalyzer');

const app = express();

const uploadStorageConfiguration = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (request, file, callback) => {
    callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const documentUpload = multer({ storage: uploadStorageConfiguration });

app.use(express.static('public'));

app.post('/upload', documentUpload.single('document'), (request, response) => {
  const uploadedFile = request.file;
  if (!uploadedFile) {
    return response.status(400).send('Please upload a document.');
  }

  response.send({ message: 'Document uploaded successfully!', filePath: request.file.path });
});

app.get('/analyze/:fileName', (request, response) => {
  const requestedFileName = request.params.fileName;
  const fullPathToDocument = path.join(__dirname, 'uploads', requestedFileName);

  fs.exists(fullPathToDocument, doesExist => {
    if (!doesExist) {
      return response.status(404).send('The file does not exist.');
    }

    analyzeDocumentContent(fullPathToDocument)
      .then(analysisResult => {
        response.json({
          message: 'Analysis complete',
          analysis: analysisResult
        });
      })
      .catch(error => {
        response.status(500).send('An error occurred during the document analysis.');
      });
  });
});

const serverPort = process.env.PORT || 3000;
app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});