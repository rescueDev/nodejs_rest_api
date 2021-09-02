const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/users", userController.getUsers);
router.post("/users", userController.generateUsers);
router.get("/users/:userName", userController.findUser);
router.post("/users/add", userController.addUser);
router.put("/users/edit/:userName", userController.updateUser);
router.delete("/users/delete/:userName", userController.deleteUser);

module.exports = router;
