const mongoose = require("mongoose");
const users = new mongoose.Schema({
    username:{ type: String, unique: true},
    password:{ type: String},
    firstname:{ type: String},
    lastname:{ type: String},
    role:{ type: String},
    isApproved:{type: Boolean}
});
module.exports = mongoose.model("users",users)