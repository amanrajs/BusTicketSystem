const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    seat_id: { type: Number },
    type: { type: String},
    status: { type: Number, default: 0 },
    owner_id:{type :mongoose.Schema.Types.ObjectId ,ref:'User'}
});

module.exports = mongoose.model('ticket', ticketSchema);