const authRoutes = require('./auth')
const industryRoutes = require('./industry')
module.exports = (app) => {
  app.get("/", (req, res) => {
    res.json({
      message: "These are Korppi APIs",
      api_health: "good",
      api_version: "V1.0.0",
    });
  });

  app.use("/v1/auth", authRoutes)
  app.use("/v1/industry", industryRoutes)
};