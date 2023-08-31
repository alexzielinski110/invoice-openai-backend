module.exports = (app, router) => {
  const jsonl = require("../controllers/jsonl.controller");

  router.get("/jsonl/get_list", jsonl.getJsonlList);
  router.get("/jsonl/upload/:file", jsonl.uploadJsonl);

  app.use("/api", router);
};
