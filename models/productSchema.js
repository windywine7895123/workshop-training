const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new mongoose.Schema({
    name:{ type : String},
    price:{ type : Number},
    stock:{ type : Number},
    orders: [{ type: Schema.Types.ObjectId, ref: 'order' }]
});
module.exports = mongoose.model("product",productSchema)