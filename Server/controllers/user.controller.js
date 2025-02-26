const { EMAIL_ACCOUNT, JWT_EXPIRES_IN, JWT_SECRET } =require("../config/env.js");
const transporter =require ("../config/nodemailer.js");
const asyncHandler =require ("../middlewares/async.midleware.js");
const User =require ("../models/user.model.js");
const jwt =require( "jsonwebtoken");
const bcrypt =require ("bcryptjs");
const { generateEmailTemplate } =require ("../utils/email-template.js");

const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

const getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

const deleteUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete an admin");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    if (req.body.isAdmin) user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({ success: true, data: updatedUser });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Enter email!" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "This email not registered!" });
    }

    const token = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const receiver = {
      from: EMAIL_ACCOUNT,
      to: email,
      subject: "Sneaker Shop: Reset Password",
      // text:`xxxx ${process.env.CLIENT_URL}/reset_password/${token}`
      // text: `Please reset your password by clicking the following link: ${process.env.FE_URL}/reset_password?token=${token}`,
      html: generateEmailTemplate({userEmail:email,resetToken:token}),
    };

    await transporter.sendMail(receiver);
    return res.status(200).json({ success: "link sent" });
  } catch (error) {
    next(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password)
      return res.status(400).json({ message: "Enter reset password" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    await user.save();
    return res.status(200).json({ message: "Password reset" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Error" });
  }
});
module.exports={getUser,getUsers,resetPassword,forgotPassword,updateUserByID,deleteUserByID}
