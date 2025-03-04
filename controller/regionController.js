const { where } = require("sequelize");
const community = require("../db/models/community");
const district = require("../db/models/district");
const region = require("../db/models/region");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync")


region.hasMany(district, { foreignKey: "region_id", as: "districts" });

const getAllRegions = catchAsync(async(req, res, next)=>{
    const result = await region.findAll();

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all regions"
        });
    }

    return res.status(200).json({
        status:"Success",
        message:"Retrieved regions successfully",
        data: result
    })
})

const getAllRegionsAndDistrict = catchAsync(async(req, res, next)=>{
    
    const result = await region.findAll(
        {
            include:[
                {
                    model:district,
                    as:'districts',
                    attributes:["id","name", "status"]
                }
            ]
        }
    );

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all regions"
        });
    }

    return res.status(200).json({
        status:"Success",
        message:"Retrieved regions successfully",
        data: result
    })
})

const getAllRegionsAndDistrictbyRegionId = catchAsync(async(req, res, next)=>{
    try {
        const id = req.params.id
    const result = await region.findAll(
        {
            where:{id: id},
            include:[
                {
                    model:district,
                    as:'districts',
                    attributes:["id","name", "status"]
                }
            ]
        }
    );

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all regions"
        });
    }

    return res.status(200).json({
        status:"Success",
        message:"Retrieved regions successfully",
        data: result
    })
    } catch (error) {
        return next(new AppError(error, 400))
    }
})


const insertRegion= catchAsync(async(req, res, next)=>{
    try {
        const body = req.body;
    const id = req.user.id;

    const newRegion = await region.create({
        name: body.name,
        createdBy: id,
        updatedBy: id
    });

    const result = newRegion.toJSON();
    
    if(!result){
        return next(new AppError("Failed to create new region", 400))
    }

    return res.status(201).json({
        status:"Success",
        message:"New region successfully created",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
    


});


const getRegion = catchAsync(async(req, res, next)=>{
    try {
        const id = req.params.id || req.query.id;
       
    
    const result = await region.findByPk(id);

    console.log(id)
    // if(!result || result===null){
    //     result = await region.findOne({
    //         where:{name:id}
    //     });
    // }


    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get region"
        });
    }


    return res.status(200).json({
        status:"Success",
        message:"Retrieved region successfully",
        data: result
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }

})

const updateRegion = catchAsync(async(req, res, next)=>{
    try {
        const body = req.body;
        const id = req.user.id
        
        if(!body.id){
            return res.status(400).json({
                status: "error",
                message: `No id passed`
            });
        }

        const result = await region.findByPk(body.id);

        if(!result){
            return res.status(400).json({
                status: "error",
                message: `No region with id ${body.id} available`
            });
        }

        result.name = body.name;
        result.updatedBy = id;

        const updated = await result.save();
        return res.status(200).json({
            status:"Success",
            message:"Successfully updated region",
            data: updated
        })

    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
})

module.exports = {getAllRegions, insertRegion, getRegion, updateRegion, getAllRegionsAndDistrict, getAllRegionsAndDistrictbyRegionId}