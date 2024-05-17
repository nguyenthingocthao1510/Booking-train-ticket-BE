const db = require("../config/database");

const ListAllTrip = async (req, res) => {
  const sql = `SELECT * FROM train t JOIN trainroute tr ON t.train_id = tr.train_id JOIN route r ON r.route_id = tr.route_id JOIN stationroute sr ON sr.route_id = r.route_id JOIN station s ON sr.station_id = s.station_id `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching trip from the database", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status.json({
        message: "There is no trip in the database",
      });
    }

    const trips = result.map((row) => ({
      train_id: row.train_id,
      route_id: row.route_id,
      station_id: row.station_id,
      train_name: row.train_name,
      departure_station: row.departure_station,
      arrival_station: row.arrival_station,
      departure_time: row.departure_time,
      breaktime: row.breaktime,
      arrival_time_expected: row.arrival_time_expected,
    }));
    return res.status(200).json({ trips });
  });
};

const ListAllTrainForTrip = async (req, res) => {
  const sql = `SELECT * FROM train`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching trip from the database", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status.json({
        message: "There is no trip in the database",
      });
    }

    const trains = result.map((row) => ({
      train_id: row.train_id,
      train_name: row.train_name,
    }));
    return res.status(200).json({ trains });
  });
};

const ListAllRouteForTrip = async (req, res) => {
  const sql = `SELECT * FROM route`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching trip from the database", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status.json({
        message: "There is no trip in the database",
      });
    }

    const routes = result.map((row) => ({
      route_id: row.route_id,
      departure_date: row.departure_date,
      departure_time: row.departure_time,
    }));
    return res.status(200).json({ routes });
  });
};

const ListAllStationForTrip = async (req, res) => {
  const sql = `SELECT * FROM station`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching trip from the database", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status.json({
        message: "There is no trip in the database",
      });
    }

    const stations = result.map((row) => ({
      station_id: row.station_id,
      departure_station: row.departure_station,
      arrival_station: row.arrival_station,
    }));
    return res.status(200).json({ stations });
  });
};

const AddNewTrip = async (req, res) => {
  try {
    const { train_id, route_id } = req.body.second;
    const stationData = req.body.first_and_half;

    const existingTrainSql = `SELECT * FROM train WHERE train_id = ?`;
    const [existingTrain] = await db
      .promise()
      .execute(existingTrainSql, [train_id]);

    if (existingTrain.length === 0) {
      return res.status(400).json({ message: "Train does not exist" });
    }

    const existingRouteSql = `SELECT * FROM route WHERE route_id = ?`;
    const [existingRoute] = await db
      .promise()
      .execute(existingRouteSql, [route_id]);

    if (existingRoute.length === 0) {
      const newRouteSql = `INSERT INTO route (route_id) VALUES (?)`;
      await db.promise().execute(newRouteSql, [route_id]);
    }

    const existingTrainRouteSql = `SELECT * FROM trainroute WHERE train_id = ? AND route_id = ?`;
    const [existingTrainRoute] = await db
      .promise()
      .execute(existingTrainRouteSql, [train_id, route_id]);

    if (existingTrainRoute.length === 0) {
      const trainRouteSql = `INSERT INTO trainroute (train_id, route_id) VALUES (?, ?)`;
      await db.promise().execute(trainRouteSql, [train_id, route_id]);
    }

    for (const station of stationData) {
      const { route_id, station_id, arrival_time_expected, breaktime } =
        station;

      const existingStationRouteSql = `SELECT * FROM stationroute WHERE route_id = ? AND station_id = ?`;
      const [existingStationRoute] = await db
        .promise()
        .execute(existingStationRouteSql, [route_id, station_id]);

      if (existingStationRoute.length > 0) {
        return res
          .status(400)
          .json({ message: "Station already assigned to the specified route" });
      }

      const stationRouteSql = `INSERT INTO stationroute (route_id, station_id, arrival_time_expected, breaktime) VALUES (?, ?, ?, ?)`;
      await db
        .promise()
        .execute(stationRouteSql, [
          route_id,
          station_id,
          arrival_time_expected,
          breaktime,
        ]);
    }

    res.status(201).json({
      message: "New trip added successfully",
    });
  } catch (error) {
    console.error("Error adding new trip", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  ListAllTrip,
  ListAllTrainForTrip,
  ListAllRouteForTrip,
  ListAllStationForTrip,
  AddNewTrip,
};
