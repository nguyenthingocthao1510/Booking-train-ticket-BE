const db = require("../config/database");

const getAll = async (req, res) => {
  const sql = `SELECT * FROM train`;

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

    const trains = result.map((row) => ({
      train_id: row.train_id,
      train_name: row.train_name,
      total_seat_of_one_train: row.total_seat_of_one_train,
    }));

    return res.status(200).json(trains);
  });
};

const searchtrainbyname = async (req, res) => {
  try {
    const encodedTrainName = req.params.train_name;
    const decodedTrainName = decodeURIComponent(encodedTrainName);

    const sql = `SELECT * FROM train WHERE train_name LIKE ?`;

    db.query(sql, [`%${decodedTrainName}%`], (err, result) => {
      if (err) {
        console.error("Error fetching train from the database", err);
        return res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }

      console.log("Result from the database: ", result);

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "There is no train in the database." });
      }

      const list = result.map((row) => ({
        train_id: row.train_id,
        train_name: row.train_name,
        total_seat_of_one_train: row.total_seat_of_one_train,
      }));

      return res.status(200).json({ list });
    });
  } catch (error) {
    console.log("Error in search name:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const ViewTrainById = async (req, res) => {
  try {
    const train_id = req.params.train_id;

    const sql = `SELECT * FROM train WHERE train_id = ?`;

    const value = [train_id];

    db.query(sql, value, (err, result) => {
      if (err) {
        console.log("Error retriving train from database", err);
        return res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }

      console.log("Result from the database: ", result);

      if (result.length === 0) {
        return res.status(404).json({
          message: "Train do not exist",
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

module.exports = {
  searchtrainbyname,
  ViewTrainById,
  getAll,
};
