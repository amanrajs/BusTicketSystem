const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Ticket = require("../models/ticketModel");
const authorisechecked = require("../middleware/checkAuth");

router.patch("/", authorisechecked, (req, res, next) => {
    const id = req.params.ticketId;
    const userData = req.userData;
    if (userData.email == "admin@admin.com" && userData.userId == "5e710aab458c8748307fe55b") {
        Ticket.updateMany({}, { $set: { owner_id: null, status: "0" } })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Reset Tickets successfully',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/tickets/'
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }
    else {
        res.status(409).json({
            message: "Forbidden operation"
        });
    }
});

module.exports = router;