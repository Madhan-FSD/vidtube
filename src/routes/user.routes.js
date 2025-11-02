import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendEmailVerification,
  resetForgotPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  verifyEmail,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  updateUserAvatarValidator,
  updateUserCoverImageValidator,
  updateUserDetailsValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgotPasswordValidator,
} from "../validators/user.validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userRegisterValidator(),
  validate,
  registerUser
);

router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/verify-email/:verificationToken").post(verifyEmail);
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword
  );
router
  .route("/update-details")
  .put(verifyJWT, updateUserDetailsValidator(), validate, updateAccountDetails);
router.route("/current-user-details").get(verifyJWT, getCurrentUser);
router
  .route("/update-avatar")
  .put(
    verifyJWT,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    updateUserAvatarValidator(),
    validate,
    updateUserAvatar
  );
router
  .route("/update-cover-image")
  .put(
    verifyJWT,
    upload.fields([{ name: "coverImage", maxCount: 1 }]),
    updateUserCoverImageValidator(),
    validate,
    updateUserCoverImage
  );
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default router;
