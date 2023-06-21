import jwt from "jsonwebtoken";

function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET);
}
