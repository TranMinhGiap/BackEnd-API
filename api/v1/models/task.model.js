const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  { 
    title: String,
    status: String,
    content: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
      type: Boolean,
      default: false
    },
    listUser: Array,
    taskParentId: String,
    createdBy: {
      user_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    deletedAt: Date
  }, {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema, "tasks");

module.exports = Task;