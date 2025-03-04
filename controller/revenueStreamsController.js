const { where } = require("sequelize");
const revenue_streams = require("../db/models/revenue_streams");

const catchAsync = require("../utils/catchAsync")

const getAllReveStreams = catchAsync(async(req, res, next)=>{
    const result = await revenue_streams.findAll();

    if(!result){
        return res.status(400).json({
            status: "error",
            message: "Failed to get all revenue streams"
        });
    }

    return res.status(200).json({
        status:"Success",
        message:"Get all revenue streams",
        data: result
    })
})


const insertrevStream= catchAsync(async(req, res, next)=>{
    try {
        const body = req.body;
    const id = req.user.id;

    const newComm = await revenue_streams.create({
        name: body.name,
        description: body.description,
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