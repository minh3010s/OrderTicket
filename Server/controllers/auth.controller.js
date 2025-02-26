const bcrypt =require ("bcryptjs");
const User =require ("../models/user.model.js");
const generateToken =require ("../utils/generateToken.js");
const asyncHandler =require ("../middlewares/async.midleware.js");
const crypto =require ("crypto");
const transporter =require ("../config/nodemailer.js")
const Path=require('../config/env.js')
// export const signUp = asyncHandler(async (req, res, next) => {
//   try {
//     const { name, email, password, role, phone } = req.body;

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       const error = new Error("User already exists");
//       error.statusCode = 409;
//       throw error;
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       phone,
//     });

//     await newUser.save();
//     generateToken(res, newUser._id);
//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: {
//         user: newUser,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

const signUp = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase(); 

    const newUser = new User({
      name,
      email,
      password, 
      role,
      phone,
      isVerified: false,
      verificationCode,
    });

    await newUser.save();

    const mailOptions = {
      from: Path.EMAIL_ACCOUNT,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email. Please verify your email before logging in.",
    });
  } catch (error) {
    next(error);
  }
});

const signIn = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    generateToken(res, user._id);
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

const signOut = asyncHandler(async (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      httyOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  try {
    const { email, verificationCode, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.isVerified = true;
    user.verificationCode = null; 

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
});
module.exports={signUp,signIn,signOut,verifyEmail}
