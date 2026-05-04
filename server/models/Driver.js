const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name:String,
  phone:String,
  carName:String,
  carNumber:String,
  status:{
    type:String,
    default:'offline'
  }
});

module.exports = mongoose.model('Driver', DriverSchema);