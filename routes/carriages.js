const express = require("express");
const carriagesController = require("../controller/carriages");

const router = express.Router();

router.get("/carriage/:train_id", carriagesController.getAllCarriages);

router.get(
  "/carriage/:train_id/:carriage_id/:route_id",
  carriagesController.getAllSeatsForCarriage
);

module.exports = router;
