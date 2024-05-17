const db = require("../config/database");

const getAll = async (req, res) => {
  const sql = `SELECT * FROM route`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching train from the database", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no train in the database" });
    }

    const route = result.map((row) => ({
      route_id: row.route_id,
      departure_date: row.departure_date,
      departure_time: row.departure_time,
    }));

    return res.status(200).json(route);
  });
};

const ViewRouteById = (req, res) => {
  try {
    const route_id = req.params.route_id;

    const sql = `SELECT * FROM route WHERE route_id = ?`;

    const value = [route_id];

    db.query(sql, value, (err, result) => {
      if (err) {
        console.log("Error retriving route from database", err);
        return res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }

      console.log("Result from the database:", result);

      if (result.lenght === 0) {
        return res.status(404).json({
          message: "Route doesn't exist",
        });
      }
      return res.status(200).json({ result });
    });
  } catch (error) {
    console.error("Error in view train by id: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const InsertNewRoute = (req, res) => {
  const { departure_date, departure_time } = req.body;

  if (!departure_date || !departure_time) {
    return res.status(400).json({
      message: "Missing required parameter in the request body.",
    });
  }

  const sql = `INSERT INTO route (departure_date, departure_time) VALUES (?, ?)`;

  const values = [departure_date, departure_time];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating new route", err);
      return res.status(500).json({
        message: "Failed to create route. Please try again later",
      });
    }
    const routeid = result.insertId;

    return res.status(201).json({
      message: "Route created succesfully",
      route_id: routeid,
    });
  });
};

module.exports = {
  ViewRouteById,
  InsertNewRoute,
  getAll,
};
