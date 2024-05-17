const db = require("../config/database");

const createBooking = (req, res) => {
  const {
    customer_id,
    station_id,
    route_id,
    train_id,
    seat_id,
    carriage_id,
    booking_date,
    payment_method,
    payment_status,
    total_price,
    passenger_full_name,
    passenger_citizen_identification_card,
    passenger_phonenumber,
  } = req.body;

  if (
    !customer_id ||
    !station_id ||
    !route_id ||
    !train_id ||
    !seat_id ||
    !carriage_id ||
    !booking_date ||
    !payment_method ||
    !payment_status ||
    !total_price ||
    !passenger_full_name ||
    !passenger_citizen_identification_card ||
    !passenger_phonenumber
  ) {
    return res.status(400).json({
      message: "Missing required parameters in the request body.",
    });
  }

  const bookingDateUTC = new Date(booking_date);
  bookingDateUTC.setHours(bookingDateUTC.getHours() + 7);
  const year = bookingDateUTC.getFullYear();
  const month = String(bookingDateUTC.getMonth() + 1).padStart(2, "0");
  const day = String(bookingDateUTC.getDate()).padStart(2, "0");
  const formattedBookingDate = `${year}-${month}-${day}`;

  const sql = `
    INSERT INTO booking (
      customer_id,
      station_id,
      route_id,
      train_id,
      seat_id,
      carriage_id,
      booking_date,
      payment_method,
      payment_status,
      total_price,
      passenger_full_name,
      passenger_citizen_identification_card,
      passenger_phonenumber
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [
    customer_id,
    station_id,
    route_id,
    train_id,
    seat_id,
    carriage_id,
    formattedBookingDate,
    payment_method,
    payment_status,
    total_price,
    passenger_full_name,
    passenger_citizen_identification_card,
    passenger_phonenumber,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating booking", err);
      return res.status(500).json({
        message: "Failed to create booking. Please try again later.",
      });
    }

    const bookingId = result.insertId;

    return res.status(201).json({
      message: "Booking created successfully",
      booking_id: bookingId,
      booking_date: formattedBookingDate,
    });
  });
};

const getBookingById = (req, res) => {
  const bookingId = req.params.booking_id;

  const sql = `
    SELECT * FROM booking
    WHERE booking_id = ?;
  `;

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error("Error retrieving booking by ID", err);
      return res.status(500).json({
        message: "Failed to retrieve booking. Please try again later.",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = result[0];

    const bookingDateUTC = new Date(booking.booking_date);
    bookingDateUTC.setHours(bookingDateUTC.getHours() + 7);
    const year = bookingDateUTC.getFullYear();
    const month = String(bookingDateUTC.getMonth() + 1).padStart(2, "0");
    const day = String(bookingDateUTC.getDate()).padStart(2, "0");
    const formattedBookingDate = `${year}-${month}-${day}`;

    const {
      booking_id,
      station_id,
      train_id,
      route_id,
      seat_id,
      carriage_id,
      passenger_full_name,
      passenger_citizen_identification_card,
      passenger_phonenumber,
      selected_seat_price,
      total_price,
    } = booking;

    const response = {
      booking_id,
      station_id,
      train_id,
      route_id,
      seat_id,
      carriage_id,
      booking_date: formattedBookingDate,
      passenger_full_name,
      passenger_citizen_identification_card,
      passenger_phonenumber,
      selected_seat_price,
      total_price,
    };

    return res.status(200).json(response);
  });
};

module.exports = {
  createBooking,
  getBookingById,
};
