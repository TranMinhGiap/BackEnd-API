const express = require('express')
const database = require('./config/database');
require('dotenv').config();
const app = express()
const port = process.env.PORT;

// routes api v1
const routesApiV1 = require('./api/v1/routes/index.route')

// Variable local view engine (Admin)
const systemConfig = require('./config/system');

// ===============================================================

// Connect to the database
database.connect();

// Route api v1
routesApiV1(app);

// Variable local view engine (Admin)
app.locals.systemConfig = systemConfig.prefixAdmin;

// ===============================================================

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})