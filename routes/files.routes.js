module.exports = (app, router) => {
  const files = require("../controllers/files.controller");

  router.get("/files", files.getFiles);
  router.delete("/files/:id", files.deleteFile);

  app.use("/api", router);
};
