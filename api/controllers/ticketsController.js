const mongoose = require("mongoose");

const Ticket = require("../models/ticketModel");

exports.get_all_ticket = (req, res, next) => {
    Ticket.find()
        .select("type status seat_id _id owner_id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                tickets: docs.map(doc => {
                    return {
                        _id: doc._id,
                        type: doc.type,
                        status: doc.status,
                        owner_id: doc.owner_id,
                        seat_id: doc.seat_id,
                        request: {
                            type: "GET",
                            url: "http://52.66.145.252:3000/tickets/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_all_open_tickets = (req, res, next) => {
    console.log("open");
    Ticket.find({ status: "0" })
        .select("type status seat_id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                tickets: docs.map(doc => {
                    return {
                        type: doc.type,
                        status: doc.status,
                        owner_id: doc.owner_id,
                        seat_id: doc.seat_id,
                        request: {
                            type: "GET",
                            use: "view details of a ticket",
                            url: "http://52.66.145.252:3000/tickets/" + doc._id
                        },
                        request: {
                            type: "GET",
                            use: "view owner details",
                            url: "http://52.66.145.252:3000/user/details" + doc.owner_id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.get_all_closed_tickets = (req, res, next) => {
    Ticket.find({ status: "1" })
        .select("type status seat_id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                tickets: docs.map(doc => {
                    return {
                        type: doc.type,
                        status: doc.status,
                        owner_id: doc.owner_id,
                        seat_id: doc.seat_id,
                        request: {
                            type: "PATCH",
                            use: "Book a seat by specifying ticket id",
                            url: "http://52.66.145.252:3000/tickets/" + doc._id
                        },
                        request: {
                            type: "GET",
                            use: "view owner details",
                            url: "http://52.66.145.252:3000/user/details" + doc.owner_id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_ticket_details = (req, res, next) => {
    const id = req.params.ticketId;
    Ticket.findById(id)
        .select('type status seat_id owner_id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    ticket: doc,
                    request: {
                        type: "GET",
                        use: "view owner details",
                        url: "http://52.66.145.252:3000/user/details" + doc.owner_id
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.book_or_cancel_ticket = (req, res, next) => {
    const id = req.params.ticketId;
    const userData = req.userData;
    const status = req.body.status;
    if (status >= 2 || status < 0) {
        res.status(400).json({
            message: "Incorrect Status for Seat"
        });
    }
    Ticket.findById(id)
        .exec()
        .then(user => {
            if (user.owner_id == userData.userId || !user.owner_id) {
                Ticket.update({ _id: id }, { $set: { status: req.body.status, owner_id: userData.userId } })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: 'Ticket updated successfully',
                            request: {
                                type: "GET",
                                use: "view owner details",
                                url: "http://52.66.145.252:3000/user/details" +user.owner_id
                            },
                            request: {
                                type: "GET",
                                use: "view all tickets",
                                url: "http://52.66.145.252:3000/tickets/"
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
        })
}