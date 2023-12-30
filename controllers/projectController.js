const Project = require("./../models/project");
const UserProject = require("./../models/userProject");
const projectRepository = require("./../repository/projectRepository");
const userRepository = require("./../repository/userRepository");

exports.insertProject = async (req, res, next) => {
  const name = req.body.name;
  const status = req.body.status;

  const project = {
    name: name,
    status: status,
  };
  let user;

  userRepository
    .getUserWithId(req.user.id)
    .then((_user) => {
      if (!_user) {
        return res.status(400).json({
          error: "user can not found.",
        });
      }

      user = _user;

      projectRepository
        .addProject(project)
        .then((_project) => {
          _project.addUser(user).then((_result) => {
            return res.status(200).json({
              status: "success",
              project: _project,
              message: "success added project and associated user",
            });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({
            status: "error",
            message: err.message,
          });
        });
    })
    .catch((err) => {
      console.log("error:", err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    });
};

exports.findAllProjects = async (req,res,next) => {
  const projects = await projectRepository.getAllProject();
  console.log("projects:",projects);
  res.status(200).json({
    message:'success',
    projects:projects,
  })
}