const authRoutes = require('./auth')
const industryRoutes = require('./industry')
const userRoutes = require('./user')
const clientRoutes = require("./client")
const serviceRoutes = require("./service")
const marketRoutes = require("./targetMarket")
const prospectsRoutes = require("./prospects")
const emailRoutes = require("./email")
const roleRoutes = require("./role")
const locationRoutes = require("./location")
const sizeRoutes = require("./companySize")

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
    app.use("/v1/user", userRoutes)
    app.use("/v1/client", clientRoutes)
    app.use("/v1/service", serviceRoutes)
    app.use("/v1/target-market", marketRoutes)
    app.use("/v1/prospects", prospectsRoutes)
    app.use("/v1/email", emailRoutes)
    app.use("/v1/roles", roleRoutes)
    app.use("/v1/locations", locationRoutes)
    app.use("/v1/company-size", sizeRoutes)

    app.use((err, req, res, next) => {
        console.error(err); // Log the error for server-side debugging
        res.status(500).json({
            isSuccess: false,
            status: 'FAILURE',
            message: 'There is some Technical Problem, please retry again',
            data: {}
        });
    });
};