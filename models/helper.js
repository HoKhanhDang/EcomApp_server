const mongoose = require('mongoose'); 
const Impressions = new mongoose.Schema({  
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model('Impressions', Impressions);