const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

const isAuth = require("../middleware/is-auth");

router.get("/all", isAuth, userController.getUsers);
router.get("/detail/:userId", isAuth, userController.getUser);
router.get("/search", isAuth, userController.getSearchUser);
router.put("/edit/:userId", isAuth, userController.updateUser);

module.exports = router;
