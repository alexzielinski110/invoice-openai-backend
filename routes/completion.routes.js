module.exports = (app, router) => {
  const completion = require("../controllers/completion.controller");

  router.post("/completion", completion.getCompletion);

  app.use("/api", router);
};
