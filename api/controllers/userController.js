const mongoose = require("mongoose");

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.user_signup = (req, res, next) => {
    console.log("signup");
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            age: req.body.age,
                            gender: req.body.gender
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: "User created",
                                    request: {
                                        type: 'POST',
                                        url: 'http://52.66.145.252:3000/user/login'
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
                });
            }
        });
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed",
                    request: {
                        type: 'POST',
                        url: 'http://52.66.145.252:3000/user/signup'
                    }
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed",
                        request: {
                            type: 'POST',
                            url: 'http://52.66.145.252:3000/user/signup'
                        }
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        "itsasecret",
                        {
                            expiresIn: "2h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed",
                    request: {
                        type: 'POST',
                        url: 'http://52.66.145.252:3000/user/signup'
                    }
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_user_details = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('name age gender')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    User: doc,
                    request: {
                        type: 'GET',
                        url: 'http://52.66.145.252:3000/tickets'
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