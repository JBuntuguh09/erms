const { Op, and } = require("sequelize");
const { where } = require("sequelize");
const community = require("../db/models/community");
const district = require("../db/models/district");
const region = require("../db/models/region");
const user = require("../db/models/user")
const catchAsync = require("../utils/catchAsync")


community.belongsTo(district, { foreignKey: "district_id", as: "district" });
district.belongsTo(region, { foreignKey: "region_id", as: "region" });

const getAllCommunities = catchAsync(async(req, res, next)=>{
    const result = await community.findAll();

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all communities"
        });
    }

    return res.status(200).json({
        status:"Success",
        message:"Get all communities",
        data: result
    })
})


const insertCommunity= catchAsync(async(req, res, next)=>{
    try {
        const body = req.body;
    const id = req.user.id;

    const newComm = await community.create({
        name: body.name,
        createdBy: id,
        updatedBy: id
    });

    const result = newComm.toJSON();
    
    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to create new Community"
        });
    }

    return res.status(201).json({
        status:"Success",
        message:"New community successfully created",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
    


});


const getCommunity = catchAsync(async(req, res, next)=>{
    try {
        const id = req.params.id
    
    const result = await community.findByPk(id);

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all communities"
        });
    }


    return res.status(200).json({
        status:"Success",
        message:"Get all community",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }

})

const updateCommunity = catchAsync(async(req, res, next)=>{
    try {
        const body = req.body;
        const id = req.user.id
        
        if(!body.id){
            return res.status(400).json({
                status: "error",
                message: `No id passed`
            });
        }

        const result = await community.findByPk(body.id);

        if(!result){
            return res.status(400).json({
                status: "error",
                message: `No community with id ${body.id} available`
            });
        }

        result.name = body.name;
        result.updatedBy = id;

        const updated = await result.save();
        return res.status(200).json({
            status:"Success",
            message:"Successfully updated community",
            data: updated
        })

    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
})

const searchCommunity= catchAsync(async(req, res, next)=>{
    try {
        const { region_id, district_id, community_name } = req.query;
    
        // Build the where condition for Community model
        let whereCondition = {};
        if (district_id) whereCondition.district_id = district_id;
       // if (district_id) whereCondition.name = "Kumasi";
        if (community_name) whereCondition.name = { [Op.iLike]: `%${community_name}%` }; // Case-insensitive search
       // if (region_id) whereCondition.district.region_id = region_id;
    
        // Define the include conditions for joins
    let includeConditions = [
        {
          model: district,
          as: "district",
          required: true, // Excludes communities with no district
          include: [],
        },
      ];
    
        // Apply region filter if provided
        if (region_id) {
          includeConditions[0].include.push({
            model: region,
            as: "region",
             where: { id: region_id },
            required: true, // Ensures filtering by region
          });
        }
    
        // Query communities with filtering
        const communities = await community.findAll({
          where: and(whereCondition),
          include: includeConditions,
        });
    
        res.status(200).json({
          status: "Success",
          message: "Communities retrieved successfully",
          data: communities,
        });
      } catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({
          status: "Error",
          message: "Internal Server Error",
        });
      }
})

module.exports = {getAllCommunities, insertCommunity, getCommunity, updateCommunity, searchCommunity}