"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const database_1 = __importDefault(require("./config/database"));
const errors_1 = __importDefault(require("./middlewares/errors"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
//setting config environemnt file variable
dotenv_1.default.config({ path: "./config/config.env" });
//Handling Uncaught Exceptions 
process.on("uncaughtException", err => {
    console.log(`ERROR: ${err.stack}`);
    console.log(`Shutting down due to uncaught exception`);
    process.exit(1); // in this case we don't need to close the server. Just need to come out (exit) from the process.
});
// connecting database 
(0, database_1.default)();
//Setting up the body parser
app.use(express_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use((0, cookie_parser_1.default)());
//Import all routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
app.use("/api/v1", authRoutes_1.default);
app.all("*", function (req, res, next) {
    next(new errorHandler_1.default(`${req.originalUrl} route not found`, 404));
});
//middleware routes to handle errors (Global error handler)
app.use(errors_1.default);
// const PORT = process.env.PORT;
const server = app.listen(8080, () => {
    console.log(`Server is listening at port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
//Handling Unhandled Promise Rejection 
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.stack}`);
    console.log(`Shutting down server due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=app.js.map