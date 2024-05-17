const db = require("../config/database");

const { format } = require("date-fns");

const getAll = (req, res) => {
  const sql = `
    SELECT st.station_id, tr.route_id, departure_station, arrival_station
    FROM station s
    JOIN stationroute st ON s.station_id = st.station_id
    JOIN route r ON r.route_id = st.route_id
    JOIN trainroute tr ON tr.route_id = r.route_id
    JOIN train t ON t.train_id = tr.train_id;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching routes from the database", err);
      return res
        .status(500)
        .json({ message: "Internal server error.", error: err.message });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no route in the database" });
    }

    const routes = result.map((row) => ({
      route_id: row.route_id,
      departure_station: row.departure_station,
      arrival_station: row.arrival_station,
    }));

    return res.status(200).json({ routes });
  });
};

const formatDate = (date) => {
  try {
    if (!date || isNaN(date.getTime())) {
      return null;
    }

    return format(date, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date:", error.message);
    return null;
  }
};

const searchstation = (req, res) => {
  try {
    if (!db) {
      console.log("Database connection not established!");
      return res.status(500).json({ message: "Internal server error" });
    }

    const encodedDepartureName = req.params.departure_station;
    const decodedDepartureName = decodeURIComponent(encodedDepartureName);
    const encodedArrivalName = req.params.arrival_station;
    const decodedArrivalName = decodeURIComponent(encodedArrivalName);
    const departure_date = req.params.departure_date;
    console.log("Encode departure station name: ", encodedDepartureName);
    console.log("Decode departure station name: ", decodedDepartureName);
    console.log("Encode arrival station name: ", encodedArrivalName);
    console.log("Decoded arrival station name: ", decodedArrivalName);

    const sql = `
      SELECT st.station_id, tr.route_id, t.train_id, t.train_name, t.total_seat_of_one_train,
      departure_station, arrival_station, r.departure_date, r.departure_time, price
      FROM station s
      JOIN stationroute st ON s.station_id = st.station_id
      JOIN route r ON r.route_id = st.route_id
      JOIN trainroute tr ON tr.route_id = r.route_id
      JOIN train t ON t.train_id = tr.train_id
      WHERE s.departure_station = ? AND s.arrival_station = ? AND r.departure_date = ?;
    `;

    db.query(
      sql,
      [decodedDepartureName, decodedArrivalName, departure_date],
      (err, result) => {
        if (err) {
          console.log("Error retrieving train from suggestion", err);
          return res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
        }

        console.log("Result from the database: ", result);

        if (result.length === 0) {
          return res
            .status(400)
            .json({ message: "Departure or Arrival do not exist" });
        }

        const list = result.map((row) => ({
          station_id: row.station_id,
          route_id: row.route_id,
          train_id: row.train_id,
          train_name: row.train_name,
          total_seat_of_one_train: row.total_seat_of_one_train,
          departure_station: row.departure_station,
          arrival_station: row.arrival_station,
          departure_date: formatDate(row.departure_date),
          departure_time: row.departure_time,
          price: row.price,
        }));

        return res.status(200).json({ list });
      }
    );
  } catch (error) {
    console.log("Error in searchstation:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getAll,
  searchstation,
};
