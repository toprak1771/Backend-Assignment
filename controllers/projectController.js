const Project = require("./../models/project");
const UserProject = require("./../models/userProject");
const projectRepository = require("./../repository/projectRepository");
const userRepository = require("./../repository/userRepository");

exports.insertProject = async (req, res, next) => {
  const name = req.body.name;
  const status = req.body.status;

  if (!name || !status)
    return res.status(400).json({
      error: "Name or status is empty",
    });

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

exports.findAllProjects = (req, res, next) => {
  projectRepository
    .getAllProject()
    .then((projects) => {
      console.log("projects:", projects);
      res.status(200).json({
        message: "success",
        projects: projects,
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

exports.removeProject = (req, res, next) => {
  const projectId = req.body.projectId;

  if (!projectId)
    return res.status(400).json({
      error: "Project id is empty",
    });

  projectRepository
    .deleteProject(projectId)
    .then((result) => {
      return res.status(200).json({
        status: "success",
        message: "Remove project and associated user successfully.",
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

exports.updateProject = (req, res, next) => {
  const _updatedProject = req.body.project;
  const projectId = req.body.projectId;

  if (!projectId || !_updatedProject)
    return res.status(400).json({
      error: "Project id or project data is empty",
    });

  projectRepository
    .updateProject(_updatedProject, projectId)
    .then((result) => {
      console.log("result2:", result);
      return res.status(200).json({
        status: "success",
        message: "Update project successfully.",
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
