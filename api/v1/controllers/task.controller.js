const sendErrorHelper = require('../../../helpers/sendError.helper');
const Task = require('../models/task.model');

// [GET] /task/
module.exports.task = async (req, res) => {
  try {
    const records = await Task.find({ deleted: false });
    res.json(records);
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}

// [GET] /task/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const records = await Task.find({ _id: id, deleted: false });
    res.json(records);
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}


