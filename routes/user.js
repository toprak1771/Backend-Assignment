const express = require("express");
const userController = require("../controllers/userController");
const { checkAuth } = require("./../utils/authenticate");

const router = express.Router();

router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/", checkAuth, userController.findAllUsers);
router.delete("/", checkAuth, userController.removeUser);
router.put("/", checkAuth, userController.updateUser);

module.exports = router;
