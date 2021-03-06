/*jshint esversion: 8 */
/* jshint node: true */

// load modules
const express = require("express");
const morgan = require("morgan");
const sequelize = require("./models/index").sequelize;

const cors = require("cors");

// Route to Course and User routes
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan("dev"));

// Setup request body JSON parsing.
app.use(express.json());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// Greeting for homepage
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my REST API project!",
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

begin = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Connection has been successfully.");
  } catch (error) {
    console.error("Unable to connect ", error);
  }
};

// start listening on our port
const server = app.listen(app.get("port"), () => {
  begin();

  console.log(` server is listening on port ${server.address().port}`);
});
