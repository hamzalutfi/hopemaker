const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const bearer = require("../middle/middle");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.post("/activate", authController.activate);
router.post("/resendactivate", authController.resendactivationCode);
router.patch("/resetpassword", authController.resetPassword);
router.patch("/changePassword", bearer, authController.changePassword);
router.get("/me", authController.me);
router.patch("/me", authController.updateCurrentUser);
router.delete("/me", authController.deleteCurrentUser);

module.exports = router;
