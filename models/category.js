const mongoose = require('mongoose');

const categoryschema = mongoose.Schema({
    faculty_name : {
        type : String,
        required : true
    }
});

const category = mongoose.model('category',categoryschema);
module.exports = category;