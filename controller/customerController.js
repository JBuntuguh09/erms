const { where, and } = require("sequelize");
const community = require("../db/models/community");
const customer = require("../db/models/customer");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");
const region = require("../db/models/region");
const district = require("../db/models/district");

// Define associations
customer.belongsTo(community, { foreignKey: 'community_id', as: 'community' });
customer.belongsTo(district, { foreignKey: 'district_id', as: 'district' });
customer.belongsTo(region, { foreignKey: 'region_id', as: 'region' });
customer.belongsTo(user, {foreignKey: 'user_id', as: 'user'});
const insertCustomer=catchAsync(async(req, res, next)=>{
    try {
        const body = req.body;
        const id = req.user.id;

        const data = await customer.create({
            name: body.name,
            phone: body.phone,
            email: body.email,
            community_id: body.community_id,
            district_id: body.district_id,
            region_id: body.region_id,
            createdBy: id,
            updatedBy: id
        })

    const result = data.toJSON();
    
    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to register new customer"
        });
    }

    return res.status(201).json({
        status:"Success",
        message:"New customer successfully registered",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
});

const getAll = catchAsync(async(req, res, next)=>{
    try {
        console.log("allo")
        const id = req.params.id;
        const role = req.user.user_role;
    
    
    const result = await customer.findAll({   
        where:{status: "Active"}, 
        include: [
                {
                    model: community,  // Assuming `community` is associated with `customer`
                    as: 'community'    // Use the alias from the Sequelize association
                },
                {
                    model: district,  // Assuming `community` is associated with `customer`
                    as: 'district'    // Use the alias from the Sequelize association
                },
                {
                    model: region,  // Assuming `community` is associated with `customer`
                    as: 'region'    // Use the alias from the Sequelize association
                },
                {
                    model: user,  // Assuming `community` is associated with `customer`
                    as: 'user'    // Use the alias from the Sequelize association
                },

            ]
    });

    result.push

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all customers"
        });
    }


    return res.status(200).json({
        status:"Success",
        message:"Get all customers",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }

})




const searchAll = catchAsync(async (req, res, next) => {
    try {
        
        const query = req.query.q || ""; // Get search term from query params
        const role = req.user.user_role;
        const { region_id, district_id, community_id } = req.query;


        console.log(query)
        // Ensure the search query is a string and not passed as an integer
    if ( typeof query !== "string") {
        return res.status(400).json({
          status: "error",
          message: "Invalid search query",
        });
      }

        let whereCondition = { status: "Active" }; // Default filter
        
        if (region_id) whereCondition.region_id = region_id;
        if (district_id) whereCondition.district_id = district_id;
        if (community_id) whereCondition.community_id = community_id;
    
        // If a search term is provided, apply filtering
        if (query) {
            whereCondition[Op.or] = [
                { name: { [Op.iLike]: `%${query}%` } },  // Case-insensitive search for name
                { phone: { [Op.iLike]: `%${query}%` } }, // Case-insensitive search for phone
                { email: { [Op.iLike]: `%${query}%` } }  // Case-insensitive search for email
            ];
        }

        const result = await customer.findAll({
            where: whereCondition,
            include: [
                {
                    model: community,
                    as: "community"
                },
                {
                    model: district,  // Assuming `community` is associated with `customer`
                    as: 'district'    // Use the alias from the Sequelize association
                },
                {
                    model: region,  // Assuming `community` is associated with `customer`
                    as: 'region'    // Use the alias from the Sequelize association
                },
                {
                    model: user,
                    as: "user"
                }
            ]
        });

        if (!result || result.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No matching customers found"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Retrieved customers successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
});



const getAllCreated = catchAsync(async (req, res, next) => {
    try {
        const id = req.user.id;

        // Fetch customers along with their community details in one query
        const result = await customer.findAll({
            where: and( { createdBy: id },
                {status: "Active"}
                ),
            include: [
                {
                    model: community,  // Assuming `community` is associated with `customer`
                    as: 'community'    // Use the alias from the Sequelize association
                },
                {
                    model: user,  // Assuming `community` is associated with `customer`
                    as: 'user'    // Use the alias from the Sequelize association
                },

            ]
        });

        // If no customers found, return an error response
        if (!result.length) {
            return res.status(400).json({
                status: "error",
                message: "Failed to get all customers"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Get all customers",
            data: result
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});

const getCustomer = catchAsync(async(req, res, next)=>{
    try {
        const id = req.params.id;
        const role = req.user.user_role;
   
    const result = await customer.findOne({ 
        where:{id: id}  ,
        include: [
                {
                    model: community,  // Assuming `community` is associated with `customer`
                    as: 'community'    // Use the alias from the Sequelize association
                },
                {
                    model: user,  // Assuming `community` is associated with `customer`
                    as: 'user'    // Use the alias from the Sequelize association
                },

            ]
    });

    

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get customers"
        });
    }


    return res.status(200).json({
        status:"Success",
        message:"Get customer suceesful",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }

})


const updateCustomer= catchAsync(async(req, res, next)=>{
    try {
        const updateData = req.body;
        const [updated] = await customer.update(updateData, { where: { id:updateData.id } });
        if (!updated) throw new Error("Customer not found");
        const result = await customer.findByPk(updateData.id);
        return res.status(201).json({
            status: "Success",
            message: "Customer successfully updated",
            data: result,
          });

      } catch (error) {

        return next(new AppError(error.message, 400))
       
      }
   
    // try {
    //     const body = req.body;
    //     const id = req.user.id
        
    //     if(!body.id){
    //         return res.status(400).json({
    //             status: "error",
    //             message: `No id passed`
    //         });
    //     }

    //     const result = await customer.findByPk(body.id);

    //     if(!result){
    //         return res.status(400).json({
    //             status: "error",
    //             message: `No customer with id ${body.id} available`
    //         });
    //     }

    //     result.name = body.name;
    //     result.updatedBy = id;
    //     result.phone = body.phone;
    //     result.email = body.email;
    //     result.user_id = body.user_id;
    //     result.community_id = body.community_id;
        

    //     const updated = await result.save();
    //     return res.status(200).json({
    //         status:"Success",
    //         message:"Successfully updated customer",
    //         data: updated
    //     })

    // } catch (error) {
    //     return res.status(400).json({
    //         status: "error",
    //         message: `${error}`
    //     });
    // }
})


module.exports = {insertCustomer, getAllCreated, getAll, getCustomer, updateCustomer, searchAll}