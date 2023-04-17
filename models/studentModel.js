const mongoose = require('mongoose');

const studentschema = mongoose.Schema({
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
    city : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    course : {
        type : String,
        required : true
    },
    fees : {
        type : String,
        required : true
    },
    faculty_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'category'
    },
    faculty_name : {
        type : mongoose.Schema.Types.String,
        ref : 'category'
    }
});

const student = mongoose.model('student',studentschema);
module.exports = student;