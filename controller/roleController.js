const role = require("../db/models/role");
const role_permission = require("../db/models/role_permission");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

role.hasMany(role_permission, { foreignKey: "role_id", as: "permissions" });
const insertRole = catchAsync(async (req, res, next) => {
    const {
        name,
        description,
        permissions
    } = req.body;

    if (!name || !description || !permissions) {
        return next(new AppError("Name, description, and permissions are required.", 400));
    }

    try {
        // Insert role
        const newRole = await role.create({
            name,
            description
        });

        // Prepare permissions data
        const permissionData = Object.keys(permissions).map((key) => ({
            role_id: newRole.id,
            app_route: key,
            allowed: permissions[key],
        }));

        // Insert permissions
       const perms = await role_permission.bulkCreate(permissionData);

        newRole.permissions = perms

       // res.status(201).send('Role and permissions added successfully.');
        return res.status(200).json({
            status:"Success",
            message:"Role and permissions added successfully",
            data: newRole
        })
    } catch (error) {
        console.error('Error inserting role and permissions:', error);
        return next(new AppError(error, 400));
    }
})

const getRolesWithPermiisions=catchAsync(async(req, res, next)=>{
    const result = await role.findAll({
        where:{
            status:"Active"
        },
        include:[
            {
                model:role_permission,
                as:'permissions',
            }
        ]
    });

    if(!result){
        return next(new AppError(error, 400));
    }

    return res.status(200).json({
        status:"Success",
        message:"Retrieved roles successfully",
        data: result
    })
})

const getRoles=catchAsync(async(req, res, next)=>{
    const result = await role.findAll({
        where:{
            status:"Active"
        }
    });

    if(!result){
        return next(new AppError(error, 400));
    }

    return res.status(200).json({
        status:"Success",
        message:"Retrieved roles successfully",
        data: result
    })
})


module.exports = {insertRole, getRolesWithPermiisions, getRoles}