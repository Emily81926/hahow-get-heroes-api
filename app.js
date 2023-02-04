if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes/index')
const app = express()
const port = process.env.PORT

app.use(routes)
app.listen(port, () => console.log(`This server is running on port ${port}`));

module.exports = app;
