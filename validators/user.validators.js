import { body } from "express-validator";
import { fileValidatorMultiUse } from "./file.validators.js";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email Id"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long")
      .isLowercase()
      .withMessage("Username must be in lowercase"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 }),

    body("fullname").trim().notEmpty().withMessage("Fullname is required"),

    body("avatar").custom(
      fileValidatorMultiUse("avatar", ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, true)
    ),

    body("coverImage").custom(
      fileValidatorMultiUse(
        "coverImage",
        ALLOWED_IMAGE_TYPES,
        MAX_IMAGE_SIZE,
        false
      )
    ),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email Id"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be minimum 8 characters"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be minimum 8 characters"),

    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be minimum 8 characters"),
  ];
};

const updateUserDetailsValidator = () => {
  return [
    body("fullname").trim().notEmpty().withMessage("Fullname is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email Id"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be minimum 8 characters"),
  ];
};

const updateUserAvatarValidator = () => {
  return [
    body("avatar").custom(
      fileValidatorMultiUse("avatar", ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, true)
    ),
  ];
};

const updateUserCoverImageValidator = () => {
  return [
    body("coverImage").custom(
      fileValidatorMultiUse(
        "coverImage",
        ALLOWED_IMAGE_TYPES,
        MAX_IMAGE_SIZE,
        true
      )
    ),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  updateUserDetailsValidator,
  updateUserAvatarValidator,
  updateUserCoverImageValidator,
};
