module.exports = (app, router) => {
  const fineTunes = require("../controllers/fine-tunes.controller");

  router.get("/fine-tunes", fineTunes.getFineTunes);
  router.post("/fine-tunes", fineTunes.createFineTunes);
  router.delete("/fine-tunes/:id", fineTunes.deleteFineTunes);
  router.post("/fine-tunes/moderations", fineTunes.moderation);

  app.use("/api", router);
};
