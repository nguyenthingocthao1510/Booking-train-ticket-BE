const express = require("express");
const router = express.Router();
const TrainController = require("../controller/managetrain");

router.get("/searchtrain/:train_name", TrainController.searchtrainbyname);
router.get("/viewtrain/:train_id", TrainController.ViewTrainById);
router.get("/listoftrain", TrainController.getAll);

module.exports = router;
