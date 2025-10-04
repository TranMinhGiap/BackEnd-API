const express = require('express')
const database = require('./config/database');
require('dotenv').config();
const app = express()
const port = process.env.PORT;

// Connect to the database
database.connect();

const Task = require('./models/task.model');

const sendErrorHelper = require('./helpers/sendError.helper');

app.get('/task', async (_, res) => {
  try {
    const task = await Task.find({ deleted: false });
    res.json(task);
  } catch (error) {
    sendErrorHelper.sendError(res, 500, 'Lỗi server', 'Lỗi server');
  }
})
app.get('/task/detail/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, deleted: false });
    res.json(task);
  } catch (error) {
    sendErrorHelper.sendError(res, 404, 'Lỗi server', 'Lỗi server');
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
