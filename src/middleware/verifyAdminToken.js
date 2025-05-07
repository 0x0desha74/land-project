const jwt = require("jsonwebtoken");
const { use } = require("../users/user.route");

const JWT_SECRET = process.env.JWT_SECRET_KEY


const verifyAdminadmin = (req,res, next) =>{
  const admin = req.headers['authorization']?.split(' ')[1];
    if (!admin) {
      return res.status (401).json({ message: 'Access Denied. No admin provided' });
    }
    jwt.verify(admin, JWT_SECRET, (err, user) =>{
      if (err) {
        return res.status(403).json({ message: 'Invalid credientials' });
      }
      req.user=user;
      next();
    })

}

module.exports = verifyAdminadmin;