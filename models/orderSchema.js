const mongoose = require("mongoose");
const { Schema } = mongoose;
const orderSchema = new mongoose.Schema({
    amount:{ type : Number},
    orderedBy:{ type : String},
    productId: { type: Schema.Types.ObjectId, ref: 'product' }
});
module.exports = mongoose.model("order",orderSchema)