const express = require('express');
require('dotenv').config();

const webServer = express();
const defaultPort = 3000;
const serverPort = process.env.PORT || defaultPort;

webServer.use(express.json());

webServer.get('/', (request, response) => {
  response.send('Hello, World!');
});

webServer.listen(serverPort, () => {
  console.log(`Server running on port ${serverPort}`);
});