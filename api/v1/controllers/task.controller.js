const sendErrorHelper = require('../../../helpers/sendError.helper');
const Task = require('../models/task.model');

const paginationHelper = require('../../../helpers/objectPagination.helper');

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
    // Pagination
    const countDocument = await Task.countDocuments();
    const objectPagination = paginationHelper.objectPagination(req.query, countDocument);
    const records = await Task.find(condition).sort(sort)
      .skip(objectPagination.skip)
      .limit(objectPagination.limit);
    // Giúp FE xử lý phân trang tốt hơn
    const data = {
      data: records,
      pagination: objectPagination
    }
    res.json(data);
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


