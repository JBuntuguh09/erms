
const user = require("../db/models/user");
const jwt = require('jsonwebtoken');
const { where } = require("sequelize");
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const region = require("../db/models/region");
const district = require("../db/models/district");
const community = require("../db/models/community");

user.belongsTo(region, { foreignKey: "region_id", as: "region" });
user.belongsTo(district, { foreignKey: "district_id", as: "district" });
user.belongsTo(community, { foreignKey: "community_id", as: "community" });
const generateWebToken=(payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIME
    })

}

const getUsers = catchAsync( async(req, res, next) =>{
    try {
        const users = await user.findAll({
            where:{
                user_status:"Active"
            },
            attributes: { exclude: ["password", "deletedAt"] },
            include :[{
                model:region,
                as:"region",
                attributes:["id", "name"]
            },
            {
                model:district,
                as:"district",
                attributes:["id", "name"]
            },
            {
                model:community,
                as:"community",
                attributes:["id", "name"]
            }
        ]
        })

       
        if(!user){return next(new AppError("No user found", 400))};
    
        return res.status(201).json({
            status:"Success",
            message:"Users successfully retrieved",
            data: users
        })
    } catch (error) {
        return next(new AppError(error, 400));
    }
})
const signUp = catchAsync( async(req, res, next) =>{

  try {
    
    const body = req.body;
    
    const newUser = await user.create({
        name: body.name,
        phone: body.phone,
        email: body.email,
        user_role_id: body.user_role_id,
        user_status: body.user_status,
        password: body.password,
        confirm_password: body.confirm_password,
        access_level: body.access_level,
        community_id: body.community_id,
        district_id: body.district_id,
        region_id: body.region_id
    })

    const result = newUser.toJSON();
    delete result.password
    delete result.deletedAt

    result.token = generateWebToken({
        id:result.id,
        user_role:result.user_role
    })

    if(!result){
        return next(new AppError("Failed to create new user", 400));
    }

    return res.status(201).json({
        status:"Success",
        message:"New user successfully created",
        data: result
    })
  } catch (error) {
    return next(new AppError(error, 400));
  }
    

});

const login = async (req, res, next)=>{
    try {
        const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError("Please enter your email and password", 404))
    }

    const result = await user.findOne({where: {
        [Op.or]:[
            {email: email},
            {phone: email}
        ]
    },
    include :[{
        model:region,
        as:"region",
        attributes:["id", "name"]
    },
    {
        model:district,
        as:"district",
        attributes:["id", "name"]
    },
    {
        model:community,
        as:"community",
        attributes:["id", "name"]
    }
]
});
    const pw = await bcrypt.compare(password, result.password);

    
    if(!result || !pw){
        return next(new AppError('Incorrect email or password', 404))
        
    }

    const token = generateWebToken({
        id:result.id,
        user_role:result.user_role
    })

    const data = result.toJSON();
    delete data.password
    delete data.deletedAt

    return res.json({
        status:"Success",
        message:"Successfully logged in",
        data: data,
        token: token
    })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: `${error}` 
        });
    }


    


}

const authenticate = catchAsync(async (req, res, next)=>{
    let idToken = "";

    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){
            idToken = req.headers.authorization.split(' ')[1];
        }
        if(!idToken || idToken===""){
            return next(new AppError("You do not have permission to access this", 404));
        }

        const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET);
        const freshUser = await user.findByPk(tokenDetail.id)

        if(!freshUser){
            return next(new AppError("User no longer exist", 400))
        }
        req.user = freshUser;
        return next();
})


module.exports = { signUp, login, authenticate, getUsers };