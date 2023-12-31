// import mongoose, { Connection } from "mongoose";
import mongoose from "mongoose";

const connectDatabase = (): void => {
  mongoose
    .connect(process.env.DB_URI!)
    .then((con) => {
      console.log(
        `MongoDb Database connected with host : ${con.connection.host}`
      );
    })
    .catch((err: any) => {
      console.error(`Error connecting to MongoDB: ${err.message}`);
    });
    
};





export default connectDatabase;
