const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  from:Object,
  to:Object,
  price:Number,
  status:String,
  paymentStatus:{
    type:String,
    default:'unpaid'
  }
});

module.exports = mongoose.model('Order', OrderSchema);