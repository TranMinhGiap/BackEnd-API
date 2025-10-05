const sendErrorHelper = require('../../../helpers/sendError.helper');
const Task = require('../models/task.model');

const paginationHelper = require('../../../helpers/objectPagination.helper');
const searchHelper = require('../../../helpers/search.helper');

// [GET] /task/
module.exports.task = async (req, res) => {
  try {
    const condition = {
      deleted: false
    }
    // Search
    const objectSearch = searchHelper.objectSearch(req.query);
    if(objectSearch.regex){
      condition.title = objectSearch.regex;
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
    const countDocument = await Task.countDocuments(condition);
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
    const records = await Task.findOne({ _id: id, deleted: false });
    res.json(records);
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}

// [PATCH] /task/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Task.updateOne({ _id: id }, { status: status })
    res.json({
      success: true,
      status: 200,
      message: "Cập nhật trạng thái thành công !"
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}

// [PATCH] /task/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    switch (key) {
      case "status":
        await Task.updateMany({ _id: { $in: ids } },{ status: value })
        break;
      default:
        break;
    }
    res.json({
      success: true,
      status: 200,
      message: "Cập nhật nhiều trạng thái thành công !"
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}

// [POST] /task/create
module.exports.create = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json({
      success: true,
      status: 200,
      message: "Thêm thành công !"
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}

// [PATCH] /task/edit/:id (Co the de id trong body cung duoc de tren url bang query cung duoc)
module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.updateOne({ _id: id }, req.body);
    res.json({
      success: true,
      status: 200,
      message: "Cập nhật thành công !"
    });
  } catch (error) {
    sendErrorHelper.sendError(res, 500, "Lỗi server", error.message);
  }
}


