const express = require("express");
const router = express.Router();
const trainController = require("../controller/train");

router.get("/train", trainController.getAllTrains);
router.get(
  "/train/:departure_station/:arrival_station/:departure_date",
  trainController.getAllTrainData
);
module.exports = router;
