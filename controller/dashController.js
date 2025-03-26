const { Op, fn, col } = require("sequelize");
const billing = require("../db/models/billing");
const business = require("../db/models/business");
const customer = require("../db/models/customer");
const entity = require("../db/models/entity");
const property = require("../db/models/property");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getDash = catchAsync(async (req, res, next) => {
  try {
    const { region_id, district_id, community_id, start_date, end_date } = req.query;

    // Base where clause
    const whereClause = { status: "Active" };

    if (region_id) whereClause.region_id = region_id;
    if (district_id) whereClause.district_id = district_id;
    if (community_id) whereClause.community_id = community_id;

    // Parse the date strings
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);
    // Set start_date to the beginning of the day
    parsedStartDate.setHours(0, 0, 0, 0);

    // Set end_date to the end of the day
    parsedEndDate.setHours(23, 59, 59, 999);

    console.log(parsedStartDate, parsedEndDate)
    const [totalCustomers] = await Promise.all([
      customer.findAndCountAll({ where: {...whereClause, 
        createdAt: { 
          [Op.between]: [parsedStartDate, parsedEndDate] 
        }, 
      }}),
    ])

    // Fetch total pending records with bill amount sum
    const totalPending = await billing.findAll({
      attributes: ["id", "bill_amount", "bill_date"], // Fetch only required fields
      where: {
        ...whereClause,
        bill_date: { [Op.between]: [start_date, end_date] },
        bill_status:"Pending"
      }, 
      
    });
    const totalValidated = await billing.findAll({
      attributes: ["id", "bill_amount", "bill_date"], // Fetch only required fields
      where: {
        ...whereClause,
        bill_date: { [Op.between]: [start_date, end_date] },
        bill_status:"Validated"
      }, 
      
    });
    const totalPaid = await billing.findAll({
      attributes: ["id", "bill_amount", "bill_date"], // Fetch only required fields
      where: {
        ...whereClause,
        bill_date: { [Op.between]: [start_date, end_date] },
        bill_status:"Paid"
      }, 
      
    });

    if (start_date && end_date) {
        whereClause.registration_date = {
            [Op.between]: [parsedStartDate, parsedEndDate] ,
        };
        }
    // Calculate total bill amount
    const countPending = totalPending.reduce((sum, record) => sum + (parseFloat(record.bill_amount) || 0), 0);
    const countValid = totalValidated.reduce((sum, record) => sum + (parseFloat(record.bill_amount) || 0), 0);
    const countPaid = totalPaid.reduce((sum, record) => sum + (parseFloat(record.bill_amount) || 0), 0);


    // Fetch customers, businesses, entities, and properties along with their counts
    const [totalBusinesses, totalEntities, totalProperties] = await Promise.all([
      
      business.findAndCountAll({ where: whereClause }),
      entity.findAndCountAll({ where: whereClause }),
      property.findAndCountAll({ where: whereClause }),
    ]);

    // Response with both data and counts
    res.status(200).json({
      status: "Success",
      message: "Successfully retrieved dashboard",
      data: {
        pending:{count:countPending, data: totalPending}, // Full list of pending billing records
        validated:{count:countValid, data: totalValidated}, // Full list of pending billing records
        paid:{count:countPaid, data: totalPaid}, // Full list of pending billing records
        customers: { count: totalCustomers.count, data: totalCustomers.rows },
        businesses: { count: totalBusinesses.count, data: totalBusinesses.rows },
        entities: { count: totalEntities.count, data: totalEntities.rows },
        properties: { count: totalProperties.count, data: totalProperties.rows },
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

module.exports = {getDash}