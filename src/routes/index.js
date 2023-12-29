const authRoutes = require('./auth')
module.exports = (app) => {
  app.get("/", (req, res) => {
    res.json({
      message: "These are Korppi APIs",
      api_health: "good",
      api_version: "V1.0.0",
    });
  });

  app.use("/v1/auth", authRoutes)
};