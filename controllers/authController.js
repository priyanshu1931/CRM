import catchAsync from "./../utils/catchAsync.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { IncomingForm } from "formidable";

import { createAndSendJWTToken } from "../utils/jwtMethods.js";
import AppError from "../utils/AppError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const login = catchAsync(async (req, res) => {
  let user = await User.findOne({ contact: req.body.contact });

  if (user) {
    const val = await bcrypt.compare(req.body.password, user.password);
    if (val) {
      return createAndSendJWTToken(
        req,
        res,
        user._id,
        201,
        "user logged in successfully"
      );
    }
    return res.json({ success: false, message: "enter correct password" });
  }
  throw new AppError("No such user not found", 404);
});

export const logout = catchAsync((req, res) => {
  return res.json({ success: true, message: "Logout successful" });
});

export const register = catchAsync(async (req, res) => {
  let user = await User.findOne({ contact: req.body.contact });

  if (user) {
    throw new AppError("User already registered", 409);
  } else {
    let fileUrl = ""; // Initialize the fileUrl variable

    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      // console.log(files.image[0].filepath);
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).send("Internal Server Error");
      }

      try {
        let filePath = files.image[0].filepath;
        fileUrl = await uploadToCloudinary(filePath);

        const { name, password, contact, role } = fields;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(String(password[0]), salt);
        User.create({
          name: name[0],
          password: hashedPassword,
          contact: contact[0],
          role: role[0],
          image: String(fileUrl),
        })
          .then((data) => {
            createAndSendJWTToken(
              req,
              res,
              data,
              201,
              "user registered successfully"
            );
          })
          .catch(() => {
            throw new AppError("Something went wrong", 500);
          });
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        res.status(500).send("Internal Server Error");
      }
    });
  }
});
