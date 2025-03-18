require("dotenv").config({path: `${process.cwd()}/.env`})
const express = require("express");
const app = express();
const cors = require("cors");
const authRouter = require('./route/authRoute');
const communityRouter = require('./route/communityRoute');
const customerRouter = require('./route/customerRoute');
const businessRouter = require('./route/businessRoute');
const revenueRouter = require('./route/revenueStreamsRoute');
const propertyRouter = require('./route/propertyRoute');
const entityRouter = require('./route/entityRoute');
const regionRouter = require('./route/regionRoute');
const districtRouter = require('./route/districtRoute');
const billingRouter = require('./route/billingRoute');
const occupancyRouter = require('./route/occupancyRoute');
const propertyTypeRouter = require('./route/propertyTypeRoute');
const businessTypeRouter = require('./route/businessTypeRoute');
const roleRouter = require('./route/roleRoute');
const dashRouter = require('./route/dashRoute');
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
app.use('/api/v1/revenue-streams', revenueRouter) 
app.use('/api/v1/property', propertyRouter) 
app.use('/api/v1/entity', entityRouter) 
app.use('/api/v1/region', regionRouter) 
app.use('/api/v1/district', districtRouter) 
app.use('/api/v1/billing', billingRouter) 
app.use('/api/v1/role', roleRouter) 
app.use('/api/v1/dashboard', dashRouter) 
app.use('/api/v1/occupancy-status', occupancyRouter) 
app.use('/api/v1/property-type', propertyTypeRouter) 
app.use('/api/v1/business-type', businessTypeRouter) 

app.use("*", catchAsync( async (req, res, next)=>{
    throw new AppError(`Route ${req.originalUrl} not found`, 404)
}))

app.use(globalErrorHandler);


const Port = process.env.APP_PORT || 4000


app.listen(Port, ()=> {
    console.log(`listening to port ${Port}`)
})