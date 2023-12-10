const express = require("express");
const app = express();

const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
const bodyParser = require("body-parser"); 


const connectDataBase = require("./config/database")
const errorMiddleware = require("./middlewares/errors")
const ErrorHandler = require("./utils/errorHandler")

//setting config environemnt file variable
dotenv.config({ path: "./config/config.env" });


//Handling Uncaught Exceptions 
process.on("uncaughtException", err =>{
  console.log(`ERROR: ${err.stack}`);
  console.log(`Shutting down due to uncaught exception`);
  process.exit(1);   // in this case we don't need to close the server. Just need to come out (exit) from the process.
})

// connecting database 
connectDataBase()

//Setting up the body parser

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));
app.use(cookieParser());

//Import all routes

const auth = require("./routes/authRoutes");



app.use("/api/v1", auth);


app.all("*", function(req, res, next){
  next( new ErrorHandler(`${req.originalUrl} route not found`, 404))
})




//middleware routes to handle errors (Global error handler)
app.use(errorMiddleware);

// const PORT = process.env.PORT;

const server = app.listen(8080, () => {
  console.log(
    `Server is listening at port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});



//Handling Unhandled Promise Rejection 

process.on("unhandledRejection", err =>{

  console.log(`Error: ${err.stack}`);
  console.log(`Shutting down server due to unhandled promise rejection`);

  server.close(()=>{
    process.exit(1);
  })
})