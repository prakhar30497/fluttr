import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// const bcrypt = require("bcrypt");

// function setPassword(value) {
//   return bcrypt.hashSync(value, 10);
// }
dotenv.config();

export const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.sendStatus(403).json({ msg: "Missing auth header" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || !decoded?.userId) return res.sendStatus(403);
    else req.userId = decoded.userId;

    console.log("decoded.id", decoded.userId);

    next();
  });
};
