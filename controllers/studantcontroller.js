const student = require('../models/studentModel');

const category = require('../models/category');

const jwtData = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const otp = require('otp-generator');

module.exports.studentregister = (req,res) => {
    student.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        city : req.body.city,
        phone : req.body.phone,
        course : req.body.course,
        fees : req.body.fees,
        faculty_id : req.body.faculty_id
    },(err,data)=>{
        if(err){
            res.status(404).json({"messege" : "student not add"});
            return false;
        }
        res.status(201).json({"messege" : "student sucessfuly added"});
    });
}

module.exports.studentlogin = (req,res) => {
    student.findOne({email : req.body.email},(err,login)=>{
        if(err){
            res.status(401).json({"messege" : "student not found"});
            return false;
        }
        if(!login || login.password != req.body.password){
            res.status(400).json({"messege" : "Email & Password are incorrect"})
        }

        const token = jwtData.sign(login.toJSON(),'student',{expiresIn:1000*60*60});
        return res.json({"Status":"1","Messege":token});
    });
};

module.exports.addcategory = (req,res) => {
    category.create({
        faculty_name : req.body.faculty_name
    },(err,categorys)=>{
        if(err){
            res.status(400).json({"messege" : "category not add"});
            return false;
        }
        res.status(200).json({"data" : categorys,"messege" : "Category is add"});
    })
};

module.exports.viewcategory = (req,res) =>
{
    student.aggregate([
        {
            $lookup:
            {
                from:"categories",
                localField:"faculty_id",
                foreignField:"_id",
                as:"faculty_id"
            }
        }
    ],(err,data)=>
    {
        if(err)
        {
            console.log(err);
        }
        res.json({"Status":"1","Messege":data});
    });
}

module.exports.studentdatashow = (req,res) => {
    student.findOne({email : req.body.email},(err,data)=>{
        // console.log(data.email);
        console.log(data.email);
        if(err){
            res.status(401).json({"messege" : "student not found"});
            return false;
        }
        if(!data || data.password != req.body.password){
            res.status(401).json({"messege" : "Email & Password are incorrect"});
        }
        res.status(200).json({"student_data" : data});
    });
};

module.exports.studentdataupdate = (req,res) => {
    let id = req.query.id;
    student.findByIdAndUpdate(id,{
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        city : req.body.city,
        phone : req.body.phone,
        course : req.body.course,
        fees : req.body.fees,
    },(err,data)=>{
        if(err){
            res.json(
                {
                    "status" : "404",
                    "messege" : "student data Not Update"
                }
            )
            return false;    
        }
        res.json(
            {
                "status" : "200",
                "messege" : "student data successfully Update"
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
    student.findOne({email : email},(err,data)=>{
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
            res.cookie('stuotp',{
                email : email,
                otp : Cotp
            });
            res.json({'status' : "200" , 'Email sent: ' : Cotp});
          });
    });
};

module.exports.otp = (req,res) => {
    if(req.cookies.stuotp.otp == req.body.otp){
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
        let email = req.cookies.stuotp.email;
        student.findOneAndUpdate({email : email},{
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