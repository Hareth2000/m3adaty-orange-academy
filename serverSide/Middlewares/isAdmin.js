// serverSide/middleware/isAdmin.js
const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = isAdmin;
