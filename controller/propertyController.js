const { Op } = require("sequelize");
const { and } = require("sequelize");
const community = require("../db/models/community");
const customer = require("../db/models/customer");
const customer_property = require("../db/models/customer_property");
const property = require("../db/models/property");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Property should have many CustomerProperty entries
property.hasMany(customer_property, { foreignKey: "property_id", as: "owners" });
customer_property.belongsTo(property, { foreignKey: "property_id" });

// CustomerProperty should belong to Customer
customer_property.belongsTo(customer, { foreignKey: "customer_id", as: "customer" });
customer.hasMany(customer_property, { foreignKey: "customer_id" });

// Define associations
property.belongsTo(community, { foreignKey: 'community_id', as: 'community' });
property.belongsTo(user, {foreignKey: 'createdBy', as: 'user'});


const insertProperty=catchAsync(async(req, res, next)=>{
    try {
        const { body, user } = req;
        const { owner, registration_date, ...propertyData } = body;
        
        if (!owner || owner.length < 1) {
          return next(new AppError("Add a property owner", 400));
        }
    
        propertyData.createdBy = user.id;
        propertyData.updatedBy = user.id;
        propertyData.registration_date = registration_date || new Date();
        
        const newProperty = await property.create(propertyData);
        if (!newProperty) {
            return next(new AppError("Failed to create new property", 400));
          
        }
    
        const newOwners = await Promise.all(
          owner.map(({ customer_id, role, description }) => 
            customer_property.create({
              property_id: newProperty.id,
              customer_id,
              role,
              description,
              createdBy: user.id,
              updatedBy: user.id,
            })
          )
        );
    
        if (!newOwners.length) {
          return next(new AppError("No owner registered", 400));
        }
    
        return res.status(201).json({
          status: "Success",
          message: "New property successfully registered",
          data: { ...newProperty.toJSON(), owner: newOwners },
        });
      } catch (error) {
        return next(new AppError(error.message, 400));
      }
})

const updateProperty=catchAsync(async(req, res, next)=>{

    try {
        const updateData = req.body;
        const [updated] = await property.update(updateData, { where: { id:updateData.id } });
        if (!updated) throw new Error("Property not found");
        const result = await property.findByPk(updateData.id);
        return res.status(201).json({
            status: "Success",
            message: "Property successfully updated",
            data: result,
          });

      } catch (error) {
        
        return next(new AppError(error.message, 400))
       
      }
})


// Get all properties
const getAllProperties = async (req, res) => {
    try {
      const properties = await property.findAll({
        where:{status: "Active"},
        include: [
          {
            model: customer_property,
            as: "owners",
            include: [{ model: customer, as: "customer",  attributes: ["id", "name"] }],
            attributes: ["id", "role"]
          },
          {
            model:community,
            as:'community',
            attributes: ["id", "name"],
          },
          {
            model:user,
            as:'user',
            attributes: ["id", "name"],
          }
        ]
      });
  
      return res.status(200).json({
        status: "Success",
        message: "Properties retrieved successfully",
        data: properties,
      });
    } catch (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }
  };
  function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); // Months are zero-based
  }
const getAllPropertiesLimit = async (req, res) => {
    try {
      const {start_date, end_date} = req.params
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

      const properties = await property.findAll({
        where:and({status: "Active"},
          {
            registration_date:Op.between(parsedStartDate, parsedEndDate)
          }
        ),
        order:[["createdAt", "DESC"]],
        include: [
          {
            model: customer_property,
            as: "owners",
            include: [{ model: customer, as: "customer",  attributes: ["id", "name"] }],
            attributes: ["id", "role"]
          },
          {
            model:community,
            as:'community',
            attributes: ["id", "name"],
          },
          {
            model:user,
            as:'user',
            attributes: ["id", "name"],
          }
        ]
      });
  
      return res.status(200).json({
        status: "Success",
        message: "Properties retrieved successfully",
        data: properties,
      });
    } catch (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }
  };

  const getPropertyById = catchAsync(async (req, res, next) => {
    try {
      const id = req.params.id;
      const prop = await property.findByPk(id, {
        include: [
          {
            model: customer_property,
            as: "owners",
            attributes: ["id", "role"], 
            include: [
              {
                model: customer,
                as: "customer",
                attributes: ["id", "name"], // Fetch only id and name
              },
            ],
          },
          {
            model: user,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model:community,
            as:'community',
            attributes: ["id", "name"],
          },
        ],
      });
  
      if (!prop) return next(new AppError("Property not found", 400));
      return res.status(200).json({
        status: "Success",
        message: "Property retrieved successfully",
        data: prop,
      });
    } catch (error) {
      return next(new AppError(`Error fetching property: ${error}`, 400));
    }
  });


module.exports = {insertProperty, updateProperty, getAllProperties, getPropertyById, getAllPropertiesLimit}