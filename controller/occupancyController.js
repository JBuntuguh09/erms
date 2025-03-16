const community = require("../db/models/community");
const district = require("../db/models/district");
const occupancy_status = require("../db/models/occupancy_status");
const region = require("../db/models/region");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

occupancy_status.belongsTo(user, {foreignKey: 'createdBy', as: 'user'});
occupancy_status.belongsTo(community, {foreignKey: 'community_id', as: 'community'});
occupancy_status.belongsTo(district, {foreignKey: 'district_id', as: 'district'});
occupancy_status.belongsTo(region, {foreignKey: 'region_id', as: 'region'});

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
            ];
        }

        const result = await occupancy_status.findAll({
            where: whereCondition,
            include: [
                
                {
                    model: user,
                    as: "user"
                },
                {
                    model: community,
                    as: "community"
                },
                {
                    model: district,
                    as: "district"
                },
                {
                    model: region,
                    as: "region"
                }
            ]
        });

        if (!result || result.length === 0) {
           
            return next(new AppError("No matching customers found", 400));
        }

        return res.status(200).json({
            status: "Success",
            message: "Retrieved occupancy statuses successfully",
            data: result
        });
    } catch (error) {
        return next(new AppError(error, 400));
    }
});


const insertData=catchAsync(async(req, res, next)=>{
    try {
        const { body, user } = req;
        const {  ...occData } = body;
        
        occData.createdBy = user.id;
        occData.updatedBy = user.id;
        
        
        const newOcc = await occupancy_status.create(occData);
        if (!newOcc) {
            return next(new AppError("Failed to create new occupancy status", 400));
          
        }

    
        return res.status(201).json({
          status: "Success",
          message: "New occupancy status successfully created",
          data: newOcc,
        });
      } catch (error) {
        return next(new AppError(error.message, 400));
      }
})


module.exports = {searchAll, insertData}