const express = require("express");
const router = express.Router();
const routeController = require("../controller/route");

router.get("/route", routeController.getAll);
router.get(
  "/route/:departure_station/:arrival_station/:departure_date",
  routeController.searchstation
);

module.exports = router;
