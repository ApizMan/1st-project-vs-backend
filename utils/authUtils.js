import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const secret = process.env.SECRET;

export const generateToken = (user) => {
  return jsonwebtoken.sign(user, secret, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch (error) {
    return false;
  }
};

export const refreshToken = (token) => {
  return jsonwebtoken.sign(token, secret, { expiresIn: "1d" });
};

export const tokenMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (req.path === "/signin" || req.path === "/signup") {
    next();
    return;
  }
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).send("Unauthorized: Invalid token");
  } else if (!decoded.userId) {
    return res.status(403).send("Forbidden: Invalid token");
  }
  req.user = decoded;
  next();
};

export const comparePasswords = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
