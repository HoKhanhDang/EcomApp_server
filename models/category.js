const mongoose = require('mongoose'); // Erase if already required
const { create } = require('./user');

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    brand:{
        type: Array,     
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    
   
});

//Export the model
module.exports = mongoose.model('Category', categorySchema);