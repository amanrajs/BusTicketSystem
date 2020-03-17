const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User");
// router.post("/", (req, res, next) => {

//   const ticket = new Ticket({
//     _id: new mongoose.Types.ObjectId(),
//     type: "Seater",
//     status: 0,
//     seat_id:req.body.seat_id,
//   });
//   console.log(ticket);
//   ticket
//     .save()
//     .then(result => {
//       console.log(result);
//       res.status(201).json({
//         message: "Created ticket successfully",
//         createdTicket: {
//             _id: new mongoose.Types.ObjectId(),
//             seat_id:result.seat_id,
//             status: result.status,
//             type: result.type,
//             owner_id:result.owner_id,
//             request: {
//                 type: 'GET',
//                 url: "http://localhost:3000/tickets/" + result._id
//             }
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
      .select('name age gender id')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              ticket: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/products'
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
  });