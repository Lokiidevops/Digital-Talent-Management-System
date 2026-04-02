const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No Authorization Token Provided" });
  }

  // Temporary bypass for the Google session we created for testing
  if (token === "google-authenticated-session") {
    const fallbackUser = await User.findOne();
    if (!fallbackUser) {
      return res.status(401).json({ message: "No users exist in DB to associate with Google Session" });
    }
    req.user = fallbackUser; 
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ message: `Token Valid, but User ID ${decoded.id} no longer exists` });
    }
    
    next();
  } catch (err) {
    console.error("Auth: Token verification failed:", err.message);
    res.status(401).json({ message: `JWT Verification Failed: ${err.message}` });
  }
};

module.exports = { protect };
