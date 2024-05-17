const express = require("express");
const router = express.Router();
const ManagementTicketController = require("../controller/manageticket");

router.get("/listofticket", ManagementTicketController.getAllTicket);

module.exports = router;
