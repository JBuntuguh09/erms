const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    return res.status(statusCode).json({
        status, 
        message,
        stack
    });
}

const sendErrProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if(error.isOperational){
        res.status(statusCode).json({
            status, 
            message
        });
    }
    return res.status(500).json({
        status: 'error',
        message: "Something went very wrong"
    });
}


const globalErrorHandler = (err, req, res, next)=>{
   // console.log(err)
   if(err.name === "Jwt expired"){
    err = new AppError("Invalid token found", 400);
   } 
   if(err.name === 'JsonwebToken'){
    err = new AppError('Invalid token', 400);
   }
    if(err.name === "SequelizeValidationError" || err.name==="SequelizeConstraintError"){
        err = new AppError(err.errors[0].message, 200)
    }
    if(process.env.NODE_ENV === 'development'){
        return sendErrorDev(err, res)
    }
    sendErrProd(err, res);
}

module.exports = globalErrorHandler; 