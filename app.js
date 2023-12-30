const express = require("express");
const sequelize = require("./utils/db");
const bodyParser = require("body-parser");
const User = require("./models/user");
const Project = require("./models/project");
const UserProject = require("./models/userProject");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const multer = require("multer");
const app = express();
const fs = require("fs");
const port = 3000;

//middlewares
app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "tmp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, "tmp");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    console.log("invalid file");
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

//Associations models
User.belongsToMany(Project, { through: "user-project", onDelete: "CASCADE" });
Project.belongsToMany(User, { through: "user-project", onDelete: "CASCADE" });

//routes
app.use("/user", userRoutes);
app.use("/project", projectRoutes);

//sequelize
sequelize
  .sync()
  //.sync({force:true})
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is started on  ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
