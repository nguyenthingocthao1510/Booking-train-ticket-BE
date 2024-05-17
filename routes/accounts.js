const express = require("express");
const accountRouter = express.Router();
const models = require("../models/accounts");
const accountController = require("../controller/accountController");

accountRouter.get("/getAccount", accountController.getAccount);
accountRouter.get("/getByID/:id", accountController.getByID);
accountRouter.get("/getaccountByID/:id", accountController.getaccountByID);
accountRouter.put("/updateaccountID/:id", accountController.updateaccountID);
accountRouter.delete(
  "/deleteAccountByID/:id",
  accountController.deleteAccountByID
);

module.exports = accountRouter;
