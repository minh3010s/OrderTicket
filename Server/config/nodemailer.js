const nodemailer=require("nodemailer");

const Path =require ("./env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: Path.EMAIL_ACCOUNT,
    pass: Path.EMAIL_PASSWORD,
  },
});

module.exports= transporter;
