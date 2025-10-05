const mongoose = require("mongoose");
const generate = require("../../../helpers/generate.helper");

const userSchema = new mongoose.Schema(
  { 
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: () => generate.generateRandomString(30)
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ],
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false
    },
  }, {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema, "users");

module.exports = User;