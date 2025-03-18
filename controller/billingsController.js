const {
  Op,
  Sequelize
} = require('sequelize');
const {
  literal
} = require("sequelize");
const sequelize = require('../config/database');
const billing = require("../db/models/billing");
const business = require("../db/models/business");
const business_type = require('../db/models/business_type');
const property_type = require('../db/models/property_type');
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
billing.belongsTo(community, {
  foreignKey: 'comunity_id',
  as: 'community'
});
billing.belongsTo(user, {
  foreignKey: 'createdBy',
  as: 'user'
});
billing.belongsTo(revenue_streams, {
  foreignKey: 'revenue_stream_id',
  as: 'revenue_streams'
});

billing.belongsTo(business, {
  foreignKey: 'action_id',
  as: 'business',
});
billing.belongsTo(entity, {
  foreignKey: 'action_id',
  as: 'entity',
});

business.belongsTo(business_type, {
  foreignKey: 'business_type_id',
  as: 'businesstype',
});
property.belongsTo(property_type, {
  foreignKey: 'property_type_id',
  as: 'propertytype',
});

const insertBill = catchAsync(async (req, res, next) => {
  try {
    const {
      body,
      user
    } = req;
    const {
      bill_date,
      ...billData
    } = body;


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
      data: newBill.toJSON(),
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
})

const updateBill = catchAsync(async (req, res, next) => {

  try {
    const updateData = req.body;
    const [updated] = await billing.update(updateData, {
      where: {
        id: updateData.id
      }
    });
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

function parseDateString(dateString) {
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day); // Months are zero-based
}

// Get all properties
const getBillings = async (req, res, next) => {
  try {
    const {
      start_date,
      end_date
    } = req.query
    // Fetch all billings
    console.log(start_date, end_date)
    var sDate = start_date
    var eDate = end_date
    if (sDate.includes("/")) {
      sDate = parseDateString(sDate)
      eDate = parseDateString(eDate)
    }

    console.log(sDate, eDate)


    // Parse the date strings
    const parsedStartDate = new Date(sDate);
    const parsedEndDate = new Date(eDate);

    const billings = await billing.findAll({
      where: {
        bill_date: {
          [Op.between]: [parsedStartDate, parsedEndDate],
        },
      },
      order: [
        ["createdAt", "DESC"]
      ]
    });

    // Iterate over each billing to fetch associated data based on type
    const billingData = await Promise.all(
      billings.map(async (billing) => {
        let associatedData = null;

        if (billing.type === 'Business') {
          associatedData = await business.findOne({
            where: {
              id: billing.action_id
            },
            attributes: ["id", "business_name", "business_type", "account_number"]
          });
        } else if (billing.type === 'Entity') {
          associatedData = await entity.findOne({
            where: {
              id: billing.action_id
            },
            attributes: ["id", "entity_description"]
          });
        } else if (billing.type === 'Property') {
          associatedData = await property.findOne({
            where: {
              id: billing.action_id
            },
            attributes: ["id", "house_no"]
          });
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
    res.status(500).json({
      error: 'An error occurred while fetching billings.'
    });
  }
};

const getEntityById = catchAsync(async (req, res, next) => {
  try {
    const id = req.params.id;
    const prop = await entity.findByPk(id, {
      include: [{
          model: customer_entity,
          as: "owners",
          attributes: ["id", "role"],
          include: [{
            model: customer,
            as: "customer",
            attributes: ["id", "name"], // Fetch only id and name
          }, ],
        },
        {
          model: user,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: community,
          as: 'community',
          attributes: ["id", "name"],
        },
        {
          model: revenue_streams,
          as: 'revenue_streams',
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

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}


const getUnBilledBusiness = catchAsync(async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const subquery = Sequelize.literal(`(
  SELECT action_id
  FROM billings
  WHERE "type" = 'Business'
  AND EXTRACT(YEAR FROM bill_date::DATE) = ${currentYear}
)`);

    const businesses = await business.findAll({
      where: {
        id: {
          [Op.notIn]: subquery
        }
      },
      include:[
          {
            model:business_type,
            as:"businesstype"
          }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Retrieved unbilled businesses",
      data: businesses,

    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

const getUnBilledProperty = catchAsync(async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const subquery = Sequelize.literal(`(
  SELECT action_id
  FROM billings
  WHERE "type" = 'Property'
  AND EXTRACT(YEAR FROM bill_date::DATE) = ${currentYear}
)`);

    const properties = await property.findAll({
      where: {
        id: {
          [Op.notIn]: subquery
        }
      },
      include:[
          {
            model:property_type,
            as:"propertytype"
          }
      ]
    });

    return res.status(200).json({
      success: true,
      message:"Retrieved unbilled properties successfully",
      data: properties,

    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return next(new AppError(error.message, 500))
  }
});

const getUnBilledEntity = catchAsync(async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const subquery = Sequelize.literal(`(
  SELECT action_id
  FROM billings
  WHERE "type" = 'Entity'
  AND EXTRACT(YEAR FROM bill_date::DATE) = ${currentYear}
)`);

    const entities = await entity.findAll({
      where: {
        id: {
          [Op.notIn]: subquery
        }
      }
    });

    return res.status(200).json({
      success: true,
      message:"Retrieved unbilled entities successfully",
      data: entities,

    });
  } catch (error) {
    console.error('Error fetching entities:', error);
    return next(new AppError(error.message, 500))
  }
});

const insertUnpaidBill = catchAsync(async (req) => {
  try {
    const {
      body,
      user
    } = req;
    const {
      bill_date,
      ...billData
    } = body;


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
      data: newBill.toJSON(),
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
})



module.exports = {
  insertBill,
  updateBill,
  getBillings,
  getUnBilledBusiness,
  getUnBilledProperty,
  getUnBilledEntity,
}