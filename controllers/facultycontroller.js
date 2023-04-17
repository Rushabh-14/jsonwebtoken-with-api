const Admin = require('../models/facultyModel');

const student = require('../models/facultyModel');

const jwtData = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const otp = require('otp-generator');

const category = require('../models/category');

module.exports.registerdata = (req,res) => {
    Admin.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        phone : req.body.phone,
        designation : req.body.designation,
        city : req.body.city
    },(err,data)=>{
        if(err)
        {
            res.json({"messege" : "something wrong"});
            return false;
        }
        return res.json({"status" : "1","messege":"Admin successfully created"});
    });
};

module.exports.facultylogindata = (req,res) =>{
    Admin.findOne({email : req.body.email},(err,admins)=>{
        if(err){
            res.json(err);
            return false;
        }
        if(!admins || admins.password != req.body.password)
        {
            res.json({"status" : "404","messege" : "Email and Password are incorrected"});
        }

        const token = jwtData.sign(admins.toJSON(),'rushabh',{expiresIn : 1000*60*60});
        return res.json({"status" : "200","token" : token});

    });
};

module.exports.deletefaculty = (req,res) => {
    let id = req.query.id;
    Admin.findById(id,(err,data)=>{
        if(err)
        {
            res.json({
                "status" : "404",
                "messege" : "User not found id not found"
            });
        }else{
            if(data)
            {
                Admin.findByIdAndDelete(id,(err,data)=>{
                    if(err){
                        res.json(
                            {
                                "status" : "404",
                                "messege" : "faculty not delete"
                            }
                        )
                        return false;    
                    }
                    res.json(
                        {
                            "status" : "200",
                            "messege" : "faculty successfully delete"
                        }
                    )
                })
            }  
        }
    })
}

module.exports.ProfileUpdate = (req,res) => {
    let id = req.query.id;
    let {name,email,password,phone,designation,city} = req.body;
    Admin.findByIdAndUpdate(id,{
        name : name,
        email : email,
        password : password,
        phone : phone,
        designation : designation,
        city : city
    },(err,data)=>{
        if(err){
            res.json(
                {
                    "status" : "404",
                    "messege" : "Profile Not Update"
                }
            )
            return false;    
        }
        res.json(
            {
                "status" : "200",
                "messege" : "Profile successfully Update"
            }
        )
    });
};

module.exports.forgotpass = (req,res) => {
    let email = req.body.email;
    let Cotp = otp.generate(6,{
        upperCaseAlphabets : false,
        lowerCaseAlphabets : false,
        specialChars : false
    })
    Admin.findOne({email : email},(err,data)=>{
        if(err){
            res.json(
                {
                    "status" : "404",
                    "messege" : "email not found"
                }
            );
        }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'parmarrushabh22@gmail.com',
              pass: 'grevhkfaernxuzbh'
            }
          });
          
          var mailOptions = {
            from: 'parmarrushabh22@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!',
            html : '<h1>your otp is '+Cotp+'</h1>'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            }
            res.cookie('userotp',{
                email : email,
                otp : Cotp
            });
            console.log(req.body.email);
            res.status(200).json({'Email sent: ' : Cotp});
          });
    });
};

module.exports.otp = (req,res) => {
    if(req.cookies.userotp.otp == req.body.otp){
        res.json(
            {
                "status" : "200",
                "messege" : "OTP SUCESSFULY MATCH"
            }
        );
    }else{
        res.json({"status" : "404" , "messege" : "OTP NOT MATCH"});
    }
};

module.exports.newpass = (req,res) => {
    let newpassword = req.body.newpassword;
    let cpassword = req.body.cpassword;
    if(newpassword == cpassword)
    {
        let email = req.cookies.userotp.email;
        Admin.findOneAndUpdate({email : email},{
            password : newpassword
        },(err,data)=>{
            if(err)
            {
                return res.json(
                    {
                        "status" : "404",
                        "messege" : "password not update"
                    }
                );
            }
            return res.json(
                {
                    "status" : "200",
                    "messege" : "password sucessfuly update"
                }
            )
        });
    }
};

module.exports.datas = (req,res) =>
{
    // console.log(req.query.id);
    category.findOne({_id : req.query.id},(err,data) => {
        student.aggregate([
            {
                $match : {"faculty_id": data._id}
            },
            {
                $lookup:
                {
                    from:"categories",
                    localField:"faculty_id",
                    foreignField:"_id",
                    as:"faculty"
                }
            }
        ],(err,student)=>{
            if(err){
                res.json(err);
                return false;
            }
            res.json({'record' : student});
        });

    });
}