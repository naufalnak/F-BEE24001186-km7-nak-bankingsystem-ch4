const express = require("express");
const UserController = require("../controllers/user");
const { validateUser } = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/users", validateUser, UserController.createUser);

router.get("/users", UserController.getUsers);
router.get("/users/:userId", UserController.getUserById);

module.exports = router;
