const db = require("../config/database");

const getAllCarriages = (req, res) => {
  try {
    const train_id = req.params.train_id;

    const sql = "SELECT * FROM carriage WHERE train_id = ?";
    const values = [train_id];

    db.query(sql, values, (err, carriages) => {
      if (err) {
        console.error("Error fetching carriages:", err);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }

      if (carriages.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No carriages found for this train.",
        });
      }

      return res.status(200).json({ success: true, carriages });
    });
  } catch (error) {
    console.error("Error in getAllCarriages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllSeatsForCarriage = (req, res) => {
  const { carriage_id, route_id } = req.params;

  const sqlSeats = "SELECT * FROM seat WHERE carriage_id = ?";
  const valuesSeats = [carriage_id];

  db.query(sqlSeats, valuesSeats, (errSeats, seats) => {
    if (errSeats) {
      console.error("Error fetching seats:", errSeats);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: errSeats.message,
      });
    }

    if (!seats || seats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No seats found for this carriage.",
      });
    }

    // Get the list of booked seats for the specified route
    const sqlBookedSeats =
      "SELECT seat_id FROM ticket WHERE carriage_id = ? AND route_id = ? AND status = 'Payment successful'";
    const valuesBookedSeats = [carriage_id, route_id];

    db.query(
      sqlBookedSeats,
      valuesBookedSeats,
      (errBookedSeats, bookedSeatsResult) => {
        if (errBookedSeats) {
          console.error("Error fetching booked seats:", errBookedSeats);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: errBookedSeats.message,
          });
        }

        const bookedSeatIds = bookedSeatsResult.map(
          (bookedSeat) => bookedSeat.seat_id
        );

        // Process seat status based on the ticket status
        const processedSeats = seats.map((seat) => {
          // Check if the seat is booked for the specified route
          if (bookedSeatIds.includes(seat.seat_id)) {
            seat.status = "Is booked";
            seat.availableSeats = 0;
          } else {
            seat.status = "Available";
            seat.availableSeats = seat.total_seat_of_one_route;
          }

          return seat;
        });

        return res.status(200).json({ success: true, seats: processedSeats });
      }
    );
  });
};

module.exports = {
  getAllCarriages,
  getAllSeatsForCarriage,
};
