const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.authToken;  // Get token from cookies
    console.log("Received token:", token);

    if (!token) {
      console.log("No token found in cookies");
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Token verification error:", err);
        return res.status(401).json({ message: 'Invalid or expired token.' });
      }

      console.log("Decoded token:", decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

module.exports = verifyToken;
