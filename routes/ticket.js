const express = require("express");
const router = express.Router();
const ticketController = require("../controller/ticket");

router.get(
  "/ticket/:customer_id",
  ticketController.TicketInformationByCustomerID
);
router.post("/ticket", ticketController.createTicketAPI);
router.put("/ticket/:booking_id", ticketController.UpdateTicketByBookingId);
router.get(
  "/ticket/book/:booking_id",
  ticketController.TicketInformationByBookingID
);
module.exports = router;
