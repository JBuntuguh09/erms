const { Op } = require("sequelize");
const { and } = require("sequelize");
const community = require("../db/models/community");
const customer = require("../db/models/customer");
const customer_entity = require("../db/models/customer_entity");

const entity = require("../db/models/entity");
const revenue_streams = require("../db/models/revenue_streams");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const moment = require("moment");

// Property should have many CustomerProperty entries
entity.hasMany(customer_entity, { foreignKey: "entity_id", as: "owners" });
customer_entity.belongsTo(entity, { foreignKey: "entity_id" });

// CustomerProperty should belong to Customer
customer_entity.belongsTo(customer, { foreignKey: "customer_id", as: "customer" });
customer.hasMany(customer_entity, { foreignKey: "customer_id" });

// Define associations
entity.belongsTo(community, { foreignKey: 'community_id', as: 'community' });
entity.belongsTo(user, {foreignKey: 'createdBy', as: 'user'});
entity.belongsTo(revenue_streams, {foreignKey: 'revenue_streams_id', as: 'revenue_streams'});


const insertEntity=catchAsync(async(req, res, next)=>{
    try {
        const { body, user } = req;
        const { owner, registration_date, ...entityData } = body;
        
        if (!owner || owner.length < 1) {
          return next(new AppError("Add a entity owner", 400));
        }
    
        entityData.createdBy = user.id;
        entityData.updatedBy = user.id;
        entityData.registration_date = registration_date || new Date();
        
        const newEntity = await entity.create(entityData);
        if (!newEntity) {
            return next(new AppError("Failed to create new entity", 400));
          
        }
    
        const newOwners = await Promise.all(
          owner.map(({ customer_id, role, description }) => 
            customer_entity.create({
              entity_id: newEntity.id,
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
          message: "New entity successfully created",
          data: { ...newEntity.toJSON(), owner: newOwners },
        });
      } catch (error) {
        return next(new AppError(error.message, 400));
      }
})

const updateEntity=catchAsync(async(req, res, next)=>{

    try {
        const updateData = req.body;
        const [updated] = await entity.update(updateData, { where: { id:updateData.id } });
        if (!updated) throw new Error("Entity not found");
        const result = await entity.findByPk(updateData.id);
        return res.status(201).json({
            status: "Success",
            message: "Entity successfully updated",
            data: result,
          });

      } catch (error) {
        
        return next(new AppError(error.message, 400))
       
      }
})


// Get all properties
const getAllEntities = async (req, res) => {
    try {
      const entities = await entity.findAll({
        where:{status: "Active"},
        include: [
          {
            model: customer_entity,
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
          },
          {
            model:revenue_streams,
            as:'revenue_streams',
            attributes: ["id", "name"],
          }
        ]
      });
  
      return res.status(200).json({
        status: "Success",
        message: "Entities retrieved successfully",
        data: entities,
      });
    } catch (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }
  };
  function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); // Months are zero-based
  }
  const getAllEntitiesByLimit = async (req, res, next) => {
    try {
      const {start_date, end_date} = req.query
     
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

    

      const entities = await entity.findAll({
        where:and({status: "Active"},
        {registration_date: {
          [Op.between]: [parsedStartDate, parsedEndDate],
        },}
        ),
        order:[["createdAt", "DESC"]],
        include: [
          {
            model: customer_entity,
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
          },
          {
            model:revenue_streams,
            as:'revenue_streams',
            attributes: ["id", "name"],
          }
        ]
      });
  
      return res.status(200).json({
        status: "Success",
        message: "Entities retrieved successfully",
        data: entities,
      });
    } catch (error) {
      return next(new AppError(error, 400));
    }
  };

  const getEntityById = catchAsync(async (req, res, next) => {
    try {
      const id = req.params.id;
      const prop = await entity.findByPk(id, {
        include: [
          {
            model: customer_entity,
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
          {
            model:revenue_streams,
            as:'revenue_streams',
            attributes: ["id", "name"],
          }
        ],
      });
  
      if (!prop) return next(new AppError("Entity not found", 400));
      return res.status(200).json({
        status: "Success",
        message: "Entity retrieved successfully",
        data: prop,
      });
    } catch (error) {
      return next(new AppError(`Error fetching entity: ${error}`, 400));
    }
  });

  const getCurrentDate=()=>{
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }


module.exports = {insertEntity, updateEntity, getAllEntities, getEntityById, getAllEntitiesByLimit}