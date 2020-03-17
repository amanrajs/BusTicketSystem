const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Name: { type: String },
    Gender: { type: String},
    Age: { type: Number},
    owner_id:{type :Number}
});

module.exports = mongoose.model('ticket', ticketSchema);