const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, default: 1 },
    owner_id:{}
});

module.exports = mongoose.model('ticket', ticketSchema);