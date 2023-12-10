const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  allUsers,
  getUserDetails,
  updateUserByAdmin,
  deleteUserByAdmin

} = require("../controllers/authController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser); //logout is applicable to only those who have logged in first so "isAuthenticatedUser"

//Admin Routes

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserByAdmin)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUserByAdmin);

module.exports = router;
