const jwt =require ("jsonwebtoken");
const { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } =require ("../config/env.js");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET,  { expiresIn: JWT_EXPIRES_IN });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: "strict",
    maxAge:  24 * 60 * 60 * 1000,
  });
  return token;
};

module.exports= generateToken;
