const jwt = require("jsonwebtoken");

// Middleware to authenticate a JWT token
const decodeAuthToken = (req, res, next) => {
  // Get the token from the header
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    req.user = null;
    return next();
  }

  // Split the header to get the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set the user ID in the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};
module.exports = decodeAuthToken;
