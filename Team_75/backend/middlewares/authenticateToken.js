import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  jwt.verify(token, "hifi", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });

    req.userId = decoded.userId;
    next();
  });
};

export default authenticateToken;
