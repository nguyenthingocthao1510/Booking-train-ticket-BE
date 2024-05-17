const db = require("../config/database");

const getAllTicket = async (req, res) => {
  const sql = `SELECT 
    customer_id,
    b.booking_id, b.route_id, b.train_id, b.carriage_id, b.seat_id, 
    b.total_price, departure_date, departure_time, departure_station, 
    arrival_station, b.passenger_full_name, 
    b.passenger_citizen_identification_card, 
    b.passenger_phonenumber,  payment_method, 
    payment_status, t.status
    FROM booking b JOIN ticket t ON b.booking_id = t.booking_id`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retriving ticket from the database", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no ticket in the database" });
    }

    const station = result.map((row) => ({
      booking_id: row.booking_id,
      customer_id: row.customer_id,
      route_id: row.route_id,
      train_id: row.train_id,
      carriage_id: row.carriage_id,
      seat_id: row.seat_id,
      price: row.price,
      departure_date: row.departure_date,
      departure_time: row.departure_time,
      departure_station: row.departure_station,
      arrival_station: row.arrival_station,
      passenger_full_name: row.passenger_full_name,
      passenger_citizen_identification_card:
        row.passenger_citizen_identification_card,
      passenger_phonenumber: row.passenger_phonenumber,
      payment_method: row.payment_method,
      payment_status: row.payment_status,
      status: row.status,
    }));
    return res.status(200).json(station);
  });
};

module.exports = {
  getAllTicket,
};
