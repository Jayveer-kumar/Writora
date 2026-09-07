import jwt from "jsonwebtoken";
// import User from "../models/userSchema";
import User from "../models/userSchema.js";

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // token hi nahi hai -> guest hai, aage badh jao
    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id");
    if (user) {
      req.user = { id: user._id.toString() };
    }

    next();
  } catch (err) {
    // token invalid/expired ho to bhi crash mat karo, sirf guest treat kar do
    next();
  }
};