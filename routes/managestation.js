const express = require("express");
const router = express.Router();
const stationController = require("../controller/managestation");

router.get("/listofstation", stationController.getAll);
router.post("/addnewstation", stationController.addNewStation);

module.exports = router;
