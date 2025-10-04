const sendErrorHelper = require('../../../helpers/sendError.helper');
const Task = require('../models/task.model');

// [GET] /task/
module.exports.task = async (req, res) => {
  try {
    const condition = {
      deleted: false
    }
    // Filter status (không phải lúc nào cũng có status)
    if(req.query.status){
      condition.status = req.query.status;
    }
    // Sort (Mặc định không có thì sẽ lấy tất cả)
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
      sort[req.query.sortKey] = req.query.sortValue;
    }
    const records = await Task.find(condition).sort(sort);
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


