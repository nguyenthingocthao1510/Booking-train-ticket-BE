const db = require("../config/database");

const getAll = async (req, res) => {
  const sql = `SELECT * FROM station`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retriving station from the database", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no station in the database" });
    }

    const station = result.map((row) => ({
      station_id: row.station_id,
      departure_station: row.departure_station,
      arrival_station: row.arrival_station,
      price: row.price,
      distance: row.distance,
    }));
    return res.status(200).json(station);
  });
};

const addNewStation = async (req, res) => {
  const { departure_station, arrival_station, price, distance } = req.body;

  if (!departure_station || !arrival_station || !price || !distance) {
    return res
      .status(400)
      .json({ message: "Missing required parameter in the request body." });
  }

  const sql = `INSERT INTO station (departure_station, arrival_station, price, distance) VALUES (?,?,?,?)`;

  const values = [departure_station, arrival_station, price, distance];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating new station", err);
      return res
        .status(500)
        .json({ message: "Failed to create station. Please try again later" });
    }

    const stationid = result.insertId;

    return res.status(201).json({
      message: "Station created successfully",
      station_id: stationid,
    });
  });
};

module.exports = {
  getAll,
  addNewStation,
};
