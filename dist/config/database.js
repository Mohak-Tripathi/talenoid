"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import mongoose, { Connection } from "mongoose";
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = () => {
    mongoose_1.default
        // .connect(process.env.DB_URI!)
        .connect("mongodb://127.0.0.1:27017/talenoid")
        .then((con) => {
        console.log(`MongoDb Database connected with host : ${con.connection.host}`);
    })
        .catch((err) => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
    });
};
exports.default = connectDatabase;
//# sourceMappingURL=database.js.map