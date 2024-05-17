const db = require("../config/database");
const bcrypt = require("bcrypt");
const getFullNameByIDCustomer = async (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT fullname FROM customer c join account a on a.account_id = c.account_id where c.account_id = ?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching account ID" });
    }
    return res.status(200).json({ Status: "Success", Customer: result });
  });
};

const getAllCustomers = async (req, res) => {
  const sql = `
        SELECT c.*, a.email, a.role, a.password
        FROM customer c
        JOIN account a ON a.account_id = c.account_id;
    `;

  db.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Error: "Error fetching customer information" });
    }
    return res
      .status(200)
      .json({ Status: "Success", CustomersInformation: result });
  });
};
const SearchUserByName = async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res
      .status(400)
      .json({ Error: "Invalid or missing 'name' parameter" });
  }

  const searchTerm = `%${name}%`;

  const sql = `
        SELECT c.*, a.email, a.role, a.password
        FROM customer c
        JOIN account a ON a.account_id = c.account_id
        WHERE LOWER(TRIM(c.fullname)) LIKE LOWER(?);
    `;

  db.query(sql, [searchTerm], (err, result) => {
    console.log("Search Term:", searchTerm);
    if (err) {
      console.error("Error searching for user by name:", err);
      return res
        .status(500)
        .json({ Error: "Error searching for user by name" });
    }
    return res
      .status(200)
      .json({ Status: "Success", CustomersInformation: result });
  });
};

const deleteCustomerByID = async (req, res) => {
  const { id } = req.params;

  try {
    await new Promise((resolve, reject) => {
      db.query("START TRANSACTION", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    await new Promise((resolve, reject) => {
      db.query("DELETE FROM customer WHERE account_id = ?", [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    await new Promise((resolve, reject) => {
      db.query("DELETE FROM account WHERE account_id = ?", [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    await new Promise((resolve, reject) => {
      db.query("COMMIT", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    return res
      .status(200)
      .json({
        Status: "Success",
        Message: "Customer and associated account deleted successfully",
      });
  } catch (error) {
    await new Promise((resolve, reject) => {
      db.query("ROLLBACK", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.error("Error deleting customer and account:", error);
    return res
      .status(500)
      .json({ Error: "Error deleting customer and account" });
  }
};

const UpdateCustomerByID = async (req, res) => {
  const { customer_id } = req.params;
  const { id_card, citizen_identification_card, fullname, phone, gender, dob } =
    req.body;
  console.log(
    id_card,
    citizen_identification_card,
    fullname,
    phone,
    gender,
    dob
  );
  const sql = `
          UPDATE customer
          SET id_card = ?, citizen_identification_card = ?, fullname = ?, phone = ?, gender = ?, dob = ?
          WHERE customer_id = ?
      `;
  const values = [
    id_card,
    citizen_identification_card,
    fullname,
    phone,
    gender,
    dob,
    customer_id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ Error: "Error updating customer information" });
    }
    return res
      .status(200)
      .json({
        Status: "Success",
        Message: "Customer information updated successfully",
      });
  });
};

const InsertCustomer = async (req, res) => {
  const { email, password } = req.body;
  const { fullname, phone, gender, dob, id_card, citizen_identification_card } =
    req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const accountInsertQuery = `
        INSERT INTO account (email, password, role)
        VALUES (?, ?, ?)
    `;
  const accountValues = [email, hashedPassword, "customer"];

  db.query(accountInsertQuery, accountValues, (accountErr, accountResult) => {
    if (accountErr) {
      return res.status(500).json({ Error: "Error creating customer account" });
    }

    const account_id = accountResult.insertId;

    const customerInsertQuery = `
            INSERT INTO customer (account_id, fullname, phone, gender, dob, id_card, citizen_identification_card)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const customerValues = [
      account_id,
      fullname,
      phone,
      gender,
      dob,
      id_card,
      citizen_identification_card,
    ];

    db.query(
      customerInsertQuery,
      customerValues,
      (customerErr, customerResult) => {
        if (customerErr) {
          db.query(
            "DELETE FROM account WHERE account_id = ?",
            [account_id],
            (deleteErr, deleteResult) => {
              if (deleteErr) {
                return res
                  .status(500)
                  .json({
                    Error:
                      "Error deleting account due to customer creation failure",
                  });
              }
              return res
                .status(500)
                .json({ Error: "Error creating customer. Account deleted." });
            }
          );
        } else {
          return res
            .status(200)
            .json({
              Status: "Success",
              Message: "Customer created successfully",
            });
        }
      }
    );
  });
};

const getCustomerByID = async (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT * FROM customer c join account a on c.account_id = a.account_id where c.account_id = ?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching user ID" });
    }
    return res.status(200).json({ Status: "Success", Account: result });
  });
};

const UpdateCustomerByID2 = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  const setClause = Object.keys(updatedData)
    .map((key) => `${key} = ?`)
    .join(", ");

  const sql = `UPDATE customer SET ${setClause} WHERE account_id = ?`;

  const values = [...Object.values(updatedData), id];

  console.log("SQL Query:", sql);
  console.log("Values:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating customer:", err);
      res.status(500).json({ error: "Failed to update customer" });
    } else {
      console.log("Customer updated successfully");
      res.status(200).json({ message: "Customer updated successfully" });
    }
  });
};

const getCustomerByID1 = async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM customer where account_id = ?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching user ID" });
    }
    return res.status(200).json({ Status: "Success", Customer: result });
  });
};

module.exports = {
  getFullNameByIDCustomer,
  getAllCustomers,
  SearchUserByName,
  deleteCustomerByID,
  UpdateCustomerByID,
  InsertCustomer,
  getCustomerByID,
  UpdateCustomerByID2,
  getCustomerByID1,
};
