const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");


router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.post("/activate", authController.activateAccount);
router.post("/resendactivate", authController.resendactivationCode);
router.patch("/resetpassword", authController.resetPassword);
module.exports = router;