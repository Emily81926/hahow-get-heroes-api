if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express')
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => res.send('This is going to be api server!'))

app.listen(port, () => console.log(`This server is running on port ${port}`));

module.exports = app;
