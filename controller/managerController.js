const db = require("../config/database");

const getFullNameByIDManager = async (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT fullname FROM manager m join account a on m.account_id = a.account_id where m.account_id = ?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching account ID" });
    }
    return res.status(200).json({ Status: "Manager", Manager: result });
  });
};

const getManagerByID = async (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT * FROM manager m join account a on m.account_id = a.account_id where m.account_id = ?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching user ID" });
    }
    return res.status(200).json({ Status: "Success", Account: result });
  });
};

module.exports = {
  getFullNameByIDManager,
  getManagerByID,
};
