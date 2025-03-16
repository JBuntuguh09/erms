const { where } = require("sequelize");
const community = require("../db/models/community");
const district = require("../db/models/district");
const region = require("../db/models/region");
const revenue_streams = require("../db/models/revenue_streams");
const user = require("../db/models/user");

const catchAsync = require("../utils/catchAsync")

revenue_streams.belongsTo(user, {foreignKey: 'createdBy', as: 'user'});
revenue_streams.belongsTo(community, {foreignKey: 'community_id', as: 'community'});
revenue_streams.belongsTo(district, {foreignKey: 'district_id', as: 'district'});
revenue_streams.belongsTo(region, {foreignKey: 'region_id', as: 'region'});

const getAllReveStreams = catchAsync(async(req, res, next)=>{
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

        const result = await revenue_streams.findAll({
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
           
            return next(new AppError("No matching revenue streams found", 400));
        }

        return res.status(200).json({
            status: "Success",
            message: "Retrieved revenue streams successfully",
            data: result
        });
    } catch (error) {
        return next(new AppError(error, 400));
    }
})


const insertrevStream= catchAsync(async(req, res, next)=>{
    try {
        const body = req.body;
    const id = req.user.id;

    const newComm = await revenue_streams.create({
        name: body.name,
        description: body.description,
        region_id: body.region_id,
        community_id: body.community_id,
        district_id: body.district_id,
        createdBy: id,
        updatedBy: id
    });

    const result = newComm.toJSON();
    
    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to create revenue stream"
        });
    }

    return res.status(201).json({
        status:"Success",
        message:"New revenue stream successfully created",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
    


});


const getRevStream = catchAsync(async(req, res, next)=>{
    try {
        const id = req.params.id
    
    const result = await revenue_streams.findByPk(id);

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get revenue streams"
        });
    }


    return res.status(200).json({
        status:"Success",
        message:"Get revenue stream",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }

})

const updateRevStreans = catchAsync(async(req, res, next)=>{
    try {
        const body = req.body;
        const id = req.user.id
        
        if(!body.id){
            return res.status(400).json({
                status: "error",
                message: `No id passed`
            });
        }

        const result = await revenue_streams.findByPk(body.id);

        if(!result){
            return res.status(400).json({
                status: "error",
                message: `No revenue streams with id ${body.id} available`
            });
        }

        result.name = body.name || result.name;
        result.description = body.description || result.description;
        result.updatedBy = id;

        const updated = await result.save();
        return res.status(200).json({
            status:"Success",
            message:"Successfully updated revenue stream",
            data: updated
        })

    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
})

module.exports = {getAllReveStreams, getRevStream, insertrevStream, updateRevStreans}