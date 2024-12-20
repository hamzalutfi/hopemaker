const express = require("express");
const router = express.Router();
const needController = require("../controller/needController");
const { upload } = require("../middle/uploadFiles");

router.get("/cases", needController.getAllCases);
router.post("/cases", upload("uploads/needs"), needController.createCase);
router.get("/cases/:id", needController.getCaseById);
router.patch("/cases/:id", needController.updateCaseById);
router.delete("/cases/:id", needController.deleteCaseById);

module.exports = router;
