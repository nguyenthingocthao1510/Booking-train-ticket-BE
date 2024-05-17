const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingprocess");

router.post("/bookingprocess", bookingController.createBooking);

router.get("/bookingprocess/:booking_id", bookingController.getBookingById);

module.exports = router;
