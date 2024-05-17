const employeeController = require('../controller/employeeController');
const express = require("express");
const router = express.Router();

router.get("/getFullNameByIDEmployee/:id", employeeController.getFullNameByIDEmployee);
router.get("/getDatafromUser", employeeController.getDatafromUser);
router.get("/getDatafromUserAndStatusFillter/:status", employeeController.getDatafromUserAndStatusFillter);
router.put("/UpdateStatusByID/:id", employeeController.UpdateStatusByID);
router.get("/getEmployeesByFullname", employeeController.getEmployeesByFullname);
router.delete("/deleteEmployeeByID/:id", employeeController.deleteEmployeeByID);
router.get("/getEmployeeByAcc/:id", employeeController.getEmployeeByAcc);
router.post("/addnewemployee", employeeController.AddNewEmployee);
router.put("/updatePhoneNumber/:id", employeeController.updatePhoneNumber);

module.exports = router;
