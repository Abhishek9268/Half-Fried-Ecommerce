const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const splitToken = token.split(' ')[1]; // Bearer TOKEN
    const verified = jwt.verify(splitToken, process.env.JWT_ACCESS_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access Denied. Admin only.' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
