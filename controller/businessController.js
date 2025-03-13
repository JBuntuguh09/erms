const { Op } = require("sequelize");
const { and } = require("sequelize");
const business = require("../db/models/business");
const community = require("../db/models/community");
const customer = require("../db/models/customer");
const customer_business = require("../db/models/customer_business");
const revenue_streams = require("../db/models/revenue_streams");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Business should have many CustomerBusiness entries
business.hasMany(customer_business, { foreignKey: "business_id", as: "owners" });
customer_business.belongsTo(business, { foreignKey: "business_id" });

// CustomerBusiness should belong to Customer
customer_business.belongsTo(customer, { foreignKey: "customer_id", as: "customer" });
customer.hasMany(customer_business, { foreignKey: "customer_id" });

// Define associations
business.belongsTo(community, { foreignKey: 'community_id', as: 'community' });
business.belongsTo(user, {foreignKey: 'createdBy', as: 'user'});
business.belongsTo(revenue_streams, {foreignKey: 'revenue_streams_id', as: 'revenue_streams'});

const newBusiness = catchAsync(async(req, res, next)=>{
    try {
        const data = req.body;
        const id = req.user.id;
        const owner = req.body.owner
       
        if(owner === undefined || owner.length < 1){
            return next(new AppError("Add a business owner", 400));
        }
        
        const newBusiness = await business.create({
            business_name: data.business_name,
            business_type: data.business_type,
            account_number: data.account_number,
            email: data.email,
            phone: data.phone,
            community_id: data.community_id,
            revenue_streams_id: data.revenue_streams_id,
            gpsLocation: data.gpsLocation,
            status: data.status, // Must be either "Active" or "Inactive"
            registration_date: data.registration_date || new Date(), // Set current date
            createdBy: id,
            updatedBy: id
        });

        const result = newBusiness.toJSON();
    
        if(!result){
            return res.status(400).json({
                status: "error",
                message: "Failed to create new business"
            });
        }

        let newCB = []
        for(var a=0; a<owner.length; a++){
           const cb =  await customer_business.create({
                business_id: result.id,
                customer_id: owner[a].customer_id,
                role: owner[a].role,
                description: owner[a].description,
                createdBy: id,
                updatedBy: id
            })

            newCB.push(cb);
        }

        if(newCB.length===0){
            return next(new AppError("No owner registered", 400))
        }
        result.owner = newCB;
    
        return res.status(201).json({
            status:"Success",
            message:"New business successfully registered",
            data: result
        })
        } catch (error) {
            return res.status(400).json({
                status: "error",
                message: `${error}`
            });
        }
});


const getMyBusiness = catchAsync(async(req, res, next)=>{
    const id = req.user.id
    const result = await business.findAll({
        where:{
            createdBy: id
        },
        include:[{
            model:user,
            as: 'user',
            attributes:["id", "name"]
        },{
            model:community,
            as: 'community',
            attributes:["id", "name"]
        },
        {
            model:customer_business,
            as: 'owners',
            include:[{model:customer, as:"customer", attributes:["id", "name"]}],
            attributes:["id", "role"],
            
        },
        {
            model:revenue_streams,
            as: "revenue_streams",
            attributes:["id", "name"]
        }
    ]
    });

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all businesses"
        });
    }

    return res.status(200).json({
        status:"Success",
        message:"Get all businesses",
        data: result
    })
});

const getAllBusiness = catchAsync(async(req, res, next)=>{
    const result = await business.findAll({
        where:{status: "Active"},
        include:[{
            model:user,
            as: 'user',
            attributes:["id", "name"]
        },{
            model:community,
            as: 'community',
            attributes:["id", "name"]
        },
        {
            model:customer_business,
            as: 'owners',
            include:[{model:customer, as:"customer", attributes:["id", "name"]}],
            attributes:["id", "role"],
            
        },
        {
            model:revenue_streams,
            as: "revenue_streams",
            attributes:["id", "name"]
        }
    ]
    });

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all businesses"
        });
    }

    return res.status(200).json({
        status:"Success",
        message:"Get all businesses",
        data: result
    })
});
function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); // Months are zero-based
  }
const getAllBusinessByLimit = catchAsync(async(req, res, next)=>{
    try {
        const {start_date, end_date} = req.query
        console.log(start_date, end_date)
        var sDate = start_date
        var eDate = end_date
        if(sDate.includes("/")){
            sDate = parseDateString(sDate)
            eDate = parseDateString(eDate)
        }
        
        console.log(sDate, eDate)


      // Parse the date strings
      const parsedStartDate = new Date(sDate);
      const parsedEndDate = new Date(eDate);

    // Set start_date to the beginning of the day
    parsedStartDate.setHours(0, 0, 0, 0);

    // Set end_date to the end of the day
    parsedEndDate.setHours(23, 59, 59, 999);
    console.log(parsedStartDate, parsedEndDate)
    const result = await business.findAll({
        where:and({status: "Active"},
        {registration_date: {
          [Op.between]: [parsedStartDate, parsedEndDate],
        },}
        ),
        include:[{
            model:user,
            as: 'user',
            attributes:["id", "name"]
        },{
            model:community,
            as: 'community',
            attributes:["id", "name"]
        },
        {
            model:customer_business,
            as: 'owners',
            include:[{model:customer, as:"customer", attributes:["id", "name"]}],
            attributes:["id", "role"],
            
        },
        {
            model:revenue_streams,
            as: "revenue_streams",
            attributes:["id", "name"]
        }
    ]
    });

    if(!result){
        return next(new AppError("Failed to get all businesses", 400));
        
    }

    return res.status(200).json({
        status:"Success",
        message:"Get all businesses",
        data: result
    })
    } catch (error) {
        return next(new AppError(error, 400));
        
    }
});

const getBusiness = catchAsync(async(req, res, next)=>{
    const id = req.params.id
    const result = await business.findOne({
        where:{
            id: id
        },
        include:[{
            model:user,
            as: 'user',
            attributes:["id", "name"]
        },{
            model:community,
            as: 'community',
            attributes:["id", "name"]
        },
        {
            model:customer_business,
            as: 'owners',
            include:[{model:customer, as:"customer", attributes:["id", "name"]}],
            attributes:["id", "role"],
            
        },
        {
            model:revenue_streams,
            as: "revenue_streams",
            attributes:["id", "name"]
        }
    ]
    });

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "No business found",
            data: result
        });
    }

    return res.status(200).json({
        status:"Success",
        message:"Business retireved successfully",
        data: result
    })
});

const updateBusiness = catchAsync(async(req, res, next)=>{
    try {
        const updateData = req.body;
        const id = updateData.id;
        const userId = req.user.id;
        const bus= await business.findByPk(id);
        if (!bus) {
            return next(new AppError("Business not found", 400)) ;
        }

       const updated = await bus.update({
            business_name: updateData.business_name || bus.business_name,
            business_type: updateData.business_type || bus.business_type,
            account_number: updateData.account_number || bus.account_number,
            email: updateData.email || bus.email,
            phone: updateData.phone || bus.phone,
            community_id: updateData.community_id || bus.community_id,
            revenue_streams_id: updateData.revenue_streams_id || bus.revenue_streams_id,
            gpsLocation: updateData.gpsLocation || bus.gpsLocation,
            status: updateData.status || bus.status, // Must be "Active" or "Inactive"
            updatedBy: userId || bus.updatedBy
        });

        return res.status(200).json({
            status:"Success",
            message:"Successfully updated business",
            data: updated
        })

    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
});



module.exports = {newBusiness, getAllBusiness, getBusiness, getMyBusiness, updateBusiness, getAllBusinessByLimit}