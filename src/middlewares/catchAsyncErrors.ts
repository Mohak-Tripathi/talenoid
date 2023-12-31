import {Request, Response, NextFunction} from "express"

// module.exports = func => (req: Request, res: Response, next: NextFunction) =>
//     Promise.resolve(func(req, res, next))
//         .catch(next)


// This utility function takes another function `func` as an argument.
const catchAsyncErrors = (func: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  // It returns a new function that will be used as middleware or a route handler.
  (req: Request, res: Response, next: NextFunction): Promise<void> =>
    // Promise.resolve is used to ensure that the function returns a Promise.
    Promise.resolve(func(req, res, next))
      // If there is an error during the execution of `func`, it is caught here.
      .catch(next);

export default catchAsyncErrors;


