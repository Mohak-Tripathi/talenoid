"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
router.route("/register").post(authController_1.registerUser);
router.route("/login").post(authController_1.loginUser);
router.route("/logout").get(auth_1.isAuthenticatedUser, authController_1.logoutUser); //logout is applicable to only those who have logged in first so "isAuthenticatedUser"
//Admin Routes
router
    .route("/admin/users")
    .get(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), authController_1.allUsers);
router
    .route("/admin/user/:id")
    .get(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), authController_1.getUserDetails)
    .put(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), authController_1.updateUserByAdmin)
    .delete(auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), authController_1.deleteUserByAdmin);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map