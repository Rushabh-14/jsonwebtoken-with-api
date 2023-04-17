const mongoose = require('mongoose');

const facultySchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    designation : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
});

const Admin = mongoose.model('adminapi',facultySchema);
module.exports = Admin;