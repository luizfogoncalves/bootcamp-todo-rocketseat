const express = require("express");

const server = express();

let projects = [];

server.use(express.json());

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

server.use((req, res, next) => {
  console.count("Execução");
  return next();
});

function verifyIdExists(req, res, next) {
  const { id } = req.params;

  const index = projects.findIndex((project, index) => {
    return project.id == id;
  });

  if (index == -1) {
    return res.status(400).json({
      status: "error",
      message: "Project doesn't exists."
    });
  } else {
    req.project = {
      index
    };
    return next();
  }

}

server.get("/projects", (req, res) => {
  res.json({
    status: "success",
    projects: projects
  });
});

server.post("/projects", (req, res, next) => {
  const project = req.body;

  if (!("id" in project)) {
    return res.status(400).json({
      status: "error",
      message: "Project needs an id"
    });
  }

  if (!("title" in project)) {
    return res.status(400).json({
      status: "error",
      message: "Project needs a title"
    });
  }

  project.tasks = [];

  projects.push(project);

  res.json({
    status: "success",
    message: "Project successfully registered!",
  });
});

server.put("/projects/:id", verifyIdExists, (req, res) => {
  const { title } = req.body;

  projects[req.project.index].title = title;

  res.json({
    status: "success",
    message: "Project successfully changed!"
  });
});

server.delete("/projects/:id", verifyIdExists, (req, res) => {
  projects.splice(req.project.index, 1);

  res.json({
    status: "success",
    message: "Project deleted successfully!"
  });
});

server.post("/projects/:id/tasks", verifyIdExists, (req, res) => {
  const { title } = req.body;

  projects[req.project.index].tasks.push(title);

  res.json({
    status: "success",
    message: "Task successfully added!"
  });
});