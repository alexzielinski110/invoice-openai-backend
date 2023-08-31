module.exports = (app, router) => {
  require("./invoice.routes")(app, router);
  require("./jsonl.routes")(app, router);
  require("./files.routes")(app, router);
  require("./fine-tunes.routes")(app, router);
  require("./completion.routes")(app, router);
  require("./bucket.routes")(app, router);
};
