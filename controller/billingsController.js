const { Op } = require("sequelize");
const { literal } = require("sequelize");
const billing = require("../db/models/billing");
const business = require("../db/models/business");
const community = require("../db/models/community");
const customer = require("../db/models/customer");
const customer_business = require("../db/models/customer_business");
const entity = require("../db/models/entity");
const property = require("../db/models/property");
const revenue_streams = require("../db/models/revenue_streams");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Business should have many CustomerBusiness entries
// business.hasMany(customer_business, { foreignKey: "business_id", as: "owners" });
// customer_business.belongsTo(business, { foreignKey: "business_id" });

// CustomerBusiness should belong to Customer
// customer_business.belongsTo(customer, { foreignKey: "customer_id", as: "customer" });
// customer.hasMany(customer_business, { foreignKey: "customer_id" });

// Define associations
billing.belongsTo(community, { foreignKey: 'comunity_id', as: 'community' });
billing.belongsTo(user, {foreignKey: 'createdBy', as: 'user'});
billing.belongsTo(revenue_streams, {foreignKey: 'revenue_stream_id', as: 'revenue_streams'});

billing.belongsTo(business, {
  foreignKey: 'action_id',
  as: 'business',
});
billing.belongsTo(entity, {
  foreignKey: 'action_id',
  as: 'entity',
});

const insertBill=catchAsync(async(req, res, next)=>{
    try {
        const { body, user } = req;
        const { bill_date, ...billData } = body;
        
    
        billData.createdBy = user.id;
        billData.updatedBy = user.id;
        billData.bill_date = getCurrentDate();
        
        const newBill = await billing.create(billData);
        if (!newBill) {
            return next(new AppError("Failed to create new bill", 400));
          
        }
    
    
        return res.status(201).json({
          status: "Success",
          message: "New bill successfully created",
          data: newBill.toJSON() ,
        });
      } catch (error) {
        return next(new AppError(error.message, 400));
      }
})

const updateBill=catchAsync(async(req, res, next)=>{

    try {
        const updateData = req.body;
        const [updated] = await billing.update(updateData, { where: { id:updateData.id } });
        if (!updated) throw new Error("Bill not found");
        const result = await billing.findByPk(updateData.id);
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
const getBillings = async (req, res, next) => {
  try {
    const {start_date, end_date} = req.query
    // Fetch all billings
    console.log(start_date, end_date)
    const billings = await billing.findAll(
      {
        where: {
          bill_date: {
            [Op.between]: [start_date, end_date],
          },
        },
        order:[["createdAt", "DESC"]]
      }
    );

    // Iterate over each billing to fetch associated data based on type
    const billingData = await Promise.all(
      billings.map(async (billing) => {
        let associatedData = null;

        if (billing.type === 'Business') {
          associatedData = await business.findOne({
             where: { id: billing.action_id },
            attributes:["id", "business_name", "business_type", "account_number"] });
        } else if (billing.type === 'Entity') {
          associatedData = await entity.findOne({ 
            where: { id: billing.action_id },
             attributes:["id","entity_description"] });
        }else if (billing.type === 'Property') {
          associatedData = await property.findOne({ 
            where: { id: billing.action_id },
             attributes:["id","house_no"] });
        }

        return {
          ...billing.toJSON(),
          associatedData,
        };
      })
    );

    return res.status(200).json({
      status: "Success",
      message: "Bills retrieved successfully",
      data: billingData,
    });
  } catch (error) {
    console.error('Error fetching billings:', error);
    res.status(500).json({ error: 'An error occurred while fetching billings.' });
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


module.exports = {insertBill, updateBill, getBillings}