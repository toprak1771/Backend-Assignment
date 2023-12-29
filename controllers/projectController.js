const Project = require("./../models/project");
const projectRepository = require("./../repository/projectRepository");

exports.insertProject = async (req, res, next) => {
  const name = req.body.name;
  const status = req.body.status;
  const userId = req.body.userId;
  console.log("name:", name);
  console.log("status:", status);
  console.log("userId:",userId);

  Project.create
};
