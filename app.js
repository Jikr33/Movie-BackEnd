const express = require("express");
const dotenv = require("dotenv");
const rfs = require("rotating-file-stream");
const cors = require("cors");
const path = require("path");

// const cookieParser = require("cookie-parser");
// const csrf = require("csurf");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
const app = express();
require("dotenv").config({ path: "./config/config.env" });

// mongoDB oruulna
const connectDB = require("./config/db");
connectDB();

const morgan = require("morgan");
// Middleware function uudiig oruulna
const logger = require("./middleware/logger");

const port = process.env.PORT;
const paths = {
    memes: "/api/v1/memes",
    movies: "/api/v1/movies",
};

// LOG hiine
var accessLogStream = rfs.createStream("access.log", {
    interval: "1d", //rotate daily
    path: path.join(__dirname, "log"),
});

app.use(cors());
// app.use(csrf());
// app.use(helmet());
app.use(express.json());
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));

// app.use(csrf({ cookie: true }));
// app.use(rateLimit());

// app.use(express.static(path.join(__dirname, "public")));
// app.use('/', express.static(path.join(__dirname, 'public')))

// Bind controllers to routes
app.use(paths.memes, require("./routes/memes"));
app.use(paths.movies, require("./routes/movies"));

// Catch all requests that don't match any route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

const server = app.listen(port, () => {
    console.log("Server running on port: ", port);
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Алдаа гарлаа  : ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
