const express = require("express");
const router = express.Router();

const UserController = require('../controllers/userController');
const authorisechecked = require("../middleware/checkAuth");

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.get('/details/:userId', authorisechecked, UserController.get_user_details);

module.exports = router;