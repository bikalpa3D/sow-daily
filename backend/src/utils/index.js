import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
};

function hashPassword(password) {
  return bcrypt.hash(password, 12);
}
// Check password
async function isPasswordCorrect(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Generate tokens
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      businessName: user.businessName,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
}

function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export {
  options,
  hashPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
};
