const authRoutes = require('./auth')
const industryRoutes = require('./industry')
const userRoutes = require('./user')
const companyRoutes = require("./company")

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
    app.use("/v1/company", companyRoutes)

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