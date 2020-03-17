const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Ticket = require("../models/Ticket");
const authorisechecked =require("../middleware/checkAuth");

router.get("/", (req, res, next) => {
    Ticket.find()
    .select("type status seat_id _id owner_id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        tickets: docs.map(doc => {
          return {
              _id:doc._id,
            type: doc.type,
            status: doc.status,
            owner_id:doc.owner_id,
            seat_id:doc.seat_id,
            request: {
              type: "GET",
              url: "http://localhost:3000/tickets/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/open", (req, res, next) => {
    console.log("open");
    Ticket.find({status:"0"})
    .select("type status seat_id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        tickets: docs.map(doc => {
          return {
            type: doc.type,
            status: doc.status,
            owner_id:doc.owner_id,
            seat_id:doc.seat_id,
            request: {
              type: "GET",
              url: "http://localhost:3000/tickets/" + doc._id
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
});

router.get("/closed", (req, res, next) => {
    Ticket.find({status:"1"})
    .select("type status seat_id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        tickets: docs.map(doc => {
          return {
            type: doc.type,
            status: doc.status,
            owner_id:doc.owner_id,
            seat_id:doc.seat_id,
            request: {
              type: "GET",
              url: "http://localhost:3000/tickets/" + doc._id
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
});
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

router.get("/:ticketId", (req, res, next) => {
  const id = req.params.ticketId;
  Ticket.findById(id)
    .select('type status seat_id owner_id')
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

router.patch("/:ticketId", authorisechecked, (req, res, next) => {
  const id = req.params.ticketId;
  const userData=req.userData;
  Ticket.findById(id)
  .exec()
  .then(user => {
      console.log(!user.owner_id);
    if (user.owner_id ==userData.userId ||  !user.owner_id ) {
        Ticket.update({ _id: id }, { $set: {status:req.body.status,owner_id:userData.userId} })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Ticket updated successfully',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
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
    else{
          res.status(409).json({
        message: "Forbidden operation"
    });
    }
})
});

// router.delete("/:productId", (req, res, next) => {
//   const id = req.params.productId;
//   Ticket.remove({ _id: id })
//     .exec()
//     .then(result => {
//       res.status(200).json({
//           message: 'Product deleted',
//           request: {
//               type: 'POST',
//               url: 'http://localhost:3000/products',
//               body: { name: 'String', price: 'Number' }
//           }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

module.exports = router;