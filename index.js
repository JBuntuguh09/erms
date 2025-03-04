require("dotenv").config({path: `${process.cwd()}/.env`})
const express = require("express");
const app = express();
const cors = require("cors");
const authRouter = require('./route/authRoute');
const communityRouter = require('./route/communityRoute');
const customerRouter = require('./route/customerRoute');
const businessRouter = require('./route/businessRoute');
const revenueRouter = require('./route/revenueStreamsRoute');
const propertyRouter = require('./route/PropertyRoute');
const entityRouter = require('./route/EntityRoute');
const regionRouter = require('./route/RegionRoute');
const districtRouter = require('./route/DistrictRoute');
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

//middleware
app.use(express.json());
 app.use(cors());


//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/community', communityRouter)
app.use('/api/v1/customer', customerRouter)
app.use('/api/v1/business', businessRouter)
app.use('/api/v1/rev_streams', revenueRouter) 
app.use('/api/v1/property', propertyRouter) 
app.use('/api/v1/entity', entityRouter) 
app.use('/api/v1/region', regionRouter) 
app.use('/api/v1/district', districtRouter) 

app.use("*", catchAsync( async (req, res, next)=>{
    throw new AppError(`Route ${req.originalUrl} not found`, 404)
}))

app.use(globalErrorHandler);


const Port = process.env.APP_PORT || 4000
console.log(Port)

app.listen(Port, ()=> {
    console.log(`listening to port ${Port}`)
})