const {
    where
} = require("sequelize");
const community = require("../db/models/community");
const district = require("../db/models/district");
const region = require("../db/models/region");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync")

const getAllDistrict = catchAsync(async (req, res, next) => {
    const result = await district.findAll();

    if (!result) {
        return res.status(400).json({
            status: "error",
            message: "Failed to get all districts"
        });
    }

    return res.status(200).json({
        status: "Success",
        message: "Retrieved districts successfully",
        data: result
    })
})

const getAllDistrictByRegion = catchAsync(async (req, res, next) => {
    try {
        const result = await district.findAll({
            where: {
                region_id: req.params.id
            },

        });

        if (!result) {
            return res.status(400).json({
                status: "error",
                message: "Failed to get all districts"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Retrieved districts successfully",
            data: result
        })
    } catch (error) {
        return next(new AppError(error, 400))
    }
})

const insertDistrictArray = catchAsync(async (req, res, next) => {
    try {
        const body = req.body;
        const id = req.user.id;
        const districts = body.districts;

        if (!districts || !Array.isArray(districts) || districts.length === 0) {
            return next(new AppError("Districts array is required and cannot be empty", 400));
        }

        const newDistricts = await Promise.all(
            districts.map(({ name, type,region_id }) => 
                district.create({
                    name,
                    type,
                    region_id,
                    createdBy: id,
                    updatedBy: id
                })
            )
        );

        if (newDistricts.length === 0) {
            return next(new AppError("Failed to create new districts", 400));
        }

        return res.status(201).json({
            status: "Success",
            message: "New districts successfully created",
            data: newDistricts.map(d => d.toJSON())  // Convert each instance to JSON
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }



});


const insertDistrict = catchAsync(async (req, res, next) => {
    try {
        const body = req.body;
        const id = req.user.id;

        const newDistrict = await district.create({
            name: body.name,
            region_id: body.region_id,
            createdBy: id,
            updatedBy: id
        });

        const result = newDistrict.toJSON();

        if (!result) {
            return next(new AppError("Failed to create new district", 400))
        }

        return res.status(201).json({
            status: "Success",
            message: "New region successfully created",
            data: result
        })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }



});


const getDistrict = catchAsync(async (req, res, next) => {
    try {
        const {
            id
        } = req.query

        const result = await district.findByPk(id);

        if (!result || result === null) {
            result = await region.findOne({
                where: {
                    name: req.params.name
                }
            });
        }


        if (!result) {
            return res.status(400).json({
                status: "error",
                message: "Failed to retrieve dustrict"
            });
        }


        return res.status(200).json({
            status: "Success",
            message: "Retrieved district successfully",
            data: result
        })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }

})

const updateDistrict = catchAsync(async (req, res, next) => {
    try {
        const body = req.body;
        const id = req.user.id

        if (!body.id) {
            return res.status(400).json({
                status: "error",
                message: `No id passed`
            });
        }

        const result = await district.findByPk(body.id);

        if (!result) {
            return res.status(400).json({
                status: "error",
                message: `No region with id ${body.id} available`
            });
        }

        result.name = body.name;
        result.updatedBy = id;

        const updated = await result.save();
        return res.status(200).json({
            status: "Success",
            message: "Successfully updated region",
            data: updated
        })

    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}`
        });
    }
})

module.exports = {
    getAllDistrict,
    insertDistrict,
    getDistrict,
    updateDistrict,
    getAllDistrictByRegion,
    insertDistrictArray
}