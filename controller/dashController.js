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

    
    const [totalCustomers] = await Promise.all([
      customer.findAndCountAll({ where: {...whereClause, 
        createdAt: { 
          [Op.between]: [new Date(start_date), new Date(end_date)] 
        }, 
      }}),
    ])

    // Fetch total pending records with bill amount sum
    const totalPending = await billing.findAll({
      attributes: ["id", "bill_amount", "bill_date"], // Fetch only required fields
      where: {
        ...whereClause,
        bill_date: { [Op.between]: [new Date(start_date), new Date(end_date)] },
      }, 
      
    });

    if (start_date && end_date) {
        whereClause.registration_date = {
            [Op.between]: [new Date(start_date), new Date(end_date)],
        };
        }
    // Calculate total bill amount
    const totalBillAmount = totalPending.reduce((sum, record) => sum + (record.bill_amount || 0), 0);

    // Fetch customers, businesses, entities, and properties along with their counts
    const [totalBusinesses, totalEntities, totalProperties] = await Promise.all([
      
      business.findAndCountAll({ where: whereClause }),
      entity.findAndCountAll({ where: whereClause }),
      property.findAndCountAll({ where: whereClause }),
    ]);

    // Response with both data and counts
    res.status(200).json({
      status: "success",
      data: {
        totalPending, // Full list of pending billing records
        totalBillAmount, // Total sum of bill_amount
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