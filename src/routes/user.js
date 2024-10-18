const express = require("express");
const UserController = require("../controllers/user");
const { validateUser } = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/users", validateUser, UserController.createUser);
router.get("/users", UserController.getUsers);
router.get("/users/:user_id", UserController.getUserById);
router.put("/users/:user_id", validateUser, UserController.updateUser);
router.delete("/users/:user_id", UserController.deleteUser);

module.exports = router;
