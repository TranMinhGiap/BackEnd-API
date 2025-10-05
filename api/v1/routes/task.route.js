const express = require("express");
const router = express.Router();

//controller
const controller = require("../controllers/task.controller")

router.get('/', controller.task)
router.get('/detail/:id', controller.detail)
router.patch('/change-status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)
router.post('/create', controller.create)

module.exports = router;