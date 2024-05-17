const customerController = require('../controller/customerController');
const express = require("express");
const router = express.Router();

router.get("/getFullNameByIDCustomer/:id", customerController.getFullNameByIDCustomer);
router.get("/getAllCustomers", customerController.getAllCustomers);
router.get("/SearchUserByName/:name", customerController.SearchUserByName);
router.delete("/deleteCustomerByID/:id", customerController.deleteCustomerByID);
router.get("/getCustomerByID/:id", customerController.getCustomerByID);

router.put("/UpdateCustomerByID/:customer_id", customerController.UpdateCustomerByID);
router.post("/InsertCustomer", customerController.InsertCustomer);

router.put("/UpdateCustomerByID2/:id", customerController.UpdateCustomerByID2);
router.get("/getCustomerByID1/:id", customerController.getCustomerByID1);

module.exports = router;
