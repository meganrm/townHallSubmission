const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(`${__dirname}/build`));

app.get('*', (request, response) => {
  console.log('New request:', request.url);
  response.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
