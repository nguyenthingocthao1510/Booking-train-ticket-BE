const express = require("express");
const router = express.Router();
const Managetripcontroller = require("../controller/managetrip");

router.get("/listalltrip", Managetripcontroller.ListAllTrip);
router.get("/listalltrainfortrip", Managetripcontroller.ListAllTrainForTrip);
router.get("/listallroutefortrip", Managetripcontroller.ListAllRouteForTrip);
router.get(
  "/listallstationfortrip",
  Managetripcontroller.ListAllStationForTrip
);
router.post("/addNewTrip", Managetripcontroller.AddNewTrip);

module.exports = router;
