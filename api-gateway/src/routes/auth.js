// login and signup routes
const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");
const adminController = require("../controllers/adminController");
const verifyToken = require("../middleware/validate");

router.post("/signup/student", studentController.createStudent);
router.post("/login/student", studentController.loginStudent);
router.get("/student/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});

router.post("/signup/admin", adminController.createAdmin);
router.post("/login/admin", adminController.loginAdmin);
router.get("/admin/verify-token", verifyToken, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});
router.post("/logout", studentController.logoutStudent);

module.exports = router;
