const managerController = require('../controller/managerController');
const express = require("express");
const router = express.Router();

router.get("/getFullNameByIDManager/:id", managerController.getFullNameByIDManager);
router.get("/getManagerByID/:id", managerController.getManagerByID);


module.exports = router;
