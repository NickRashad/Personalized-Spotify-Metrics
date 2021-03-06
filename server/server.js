const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const { topResults } = require('./converter');
const testFile = require('../StreamingHistory.json');
const bodyParser = require('body-parser')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs').promises;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '3000kb'}))
app.use(express.static('client/dist'))

// app.get('/', (req, res) => );
app.get('/topResults', (req, res) => {
  res.send(topResults(testFile));
});

app.post('/', upload.single('StreamingHistory'), (req, res) => {
  const getResults = async () => {
    let content = await fs.readFile(`uploads/${req.file.filename}`, 'utf8');
    res.send(topResults(JSON.parse(content)));
  };
  getResults();
});

app.post('/stream', (req, res) => {
  // console.log(Object.keys(req.body.data.finalFile))
  let content = topResults(JSON.parse(req.body.data.finalFile));
  res.send(content)
})
app.listen(port, () => console.log(`Listening on port ${port}`));
