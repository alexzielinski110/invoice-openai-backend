module.exports = (app, router) => {
  const invoice = require("../controllers/invoice.controller");

  router.post("/invoice/upload", invoice.uploadInvoice);
  router.post("/invoice/create_jsonl", invoice.createJSONL);

  app.use("/api", router);
};
