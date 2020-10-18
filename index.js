const express = require('express'),
app = express(),
PORT = 3000;

app.use(express.static("src"))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Hosted at http://localhost:${PORT}`)
})