const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const tokenHead = req.header("Authorization");

  if (!tokenHead) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Split the header to get the token
  const token = tokenHead.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authorize;
