const express = require("express");
const router = express.Router();

const authorisechecked = require("../middleware/checkAuth");
const TicketsController = require("../controllers/ticketsController");

router.get("/", TicketsController.get_all_ticket);

router.get("/open", TicketsController.get_all_open_tickets);

router.get("/closed", TicketsController.get_all_closed_tickets);

router.get("/:ticketId", TicketsController.get_ticket_details);

router.patch("/:ticketId", authorisechecked, TicketsController.book_or_cancel_ticket);

module.exports = router;