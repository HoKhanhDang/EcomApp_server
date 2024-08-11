const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
});

//Export the model
module.exports = mongoose.model('Brand', brandSchema);