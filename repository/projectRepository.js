const Project = require("./../models/project");
const User = require("./../models/user");

exports.addProject = (project) => {
  const projectId = Project.create({
    name: project.name,
    status: project.status,
  })
    .then((result) => {
      console.log("Project add successfully.");
      console.log("result:", result);
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return new Promise((resolve, reject) => {
    return resolve(projectId);
  });
};

exports.getAllProject = () => {
  const projects = Project.findAll({
    include: [
      {
        model: User,
        through: { attributes: [] },
      },
    ],
  })
    .then((projects) => {
      console.log("projects:", projects);
      return projects;
    })
    .catch((err) => {
      console.log(err);
    });
  return new Promise((resolve, reject) => {
    return resolve(projects);
  });
};

exports.deleteProject = (projectId) => {
  const delProjectId = Project.destroy({
    where: {
      id: projectId,
    },
  })
    .then((result) => {
      console.log("result:", result);
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return new Promise((resolve, reject) => {
    return resolve(delProjectId);
  });
};

exports.updateProject = (updatedProject, projectId) => {
  const _updatedProject = Project.update(updatedProject, {
    where: {
      id: projectId,
    },
  })
    .then((result) => {
      console.log("result:", result);
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return new Promise((resolve, reject) => {
    return resolve(_updatedProject);
  });
};
