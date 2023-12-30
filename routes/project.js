const express = require("express");
const projectController = require("./../controllers/projectController");
const { checkAuth } = require("./../utils/authenticate");

const router = express.Router();

router.post("/", checkAuth, projectController.insertProject);
router.get('/',checkAuth,projectController.findAllProjects);

module.exports = router;
