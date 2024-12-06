const express = require("express");
const router = express.Router();
const needController = require("../controller/needController");
router.get('/cases', needController.getAllCases);
router.get('/cases/:id',needController.getCaseById);
router.patch('/cases/:id',needController.updateCaseById);
router.delete('/cases/:id',needController.deleteCaseById);

module.exports = router;