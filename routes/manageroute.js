const express = require("express");
const router = express.Router();
const managerouteControl = require("../controller/manageroute");

router.get("/viewroute/:route_id", managerouteControl.ViewRouteById);
router.post("/insertnewroute", managerouteControl.InsertNewRoute);
router.get("/listofroute", managerouteControl.getAll);

module.exports = router;
