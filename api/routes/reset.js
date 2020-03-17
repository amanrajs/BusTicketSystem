const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Ticket = require("../models/Ticket");
const authorisechecked =require("../middleware/checkAuth");

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJJZCI6IjVlNzEwYWFiNDU4Yzg3NDgzMDdmZTU1YiIsImlhdCI6MTU4NDQ2NjYyNiwiZXhwIjoxNTg0NDczODI2fQ.JprlYl-3dVh1uL4vSNa0JWTnSSOHGmaVDTlDI8ab-MM
router.patch("/", authorisechecked, (req, res, next) => {
    const id = req.params.ticketId;
    const userData=req.userData;
    if(userData.email=="admin@admin.com" && userData.userId=="5e710aab458c8748307fe55b"){
        Ticket.updateMany({},{$set:{owner_id:null ,status:"0"}})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Reset Tickets successfully',
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
  });  

  module.exports = router;