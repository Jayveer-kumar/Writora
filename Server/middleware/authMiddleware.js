import jwt from "jsonwebtoken";

export const protectRoute = async (req,res,next) => {
    try {
        // 1. Get the token from the header
        const token = req.headers.authorization?.split(" ")[1];

        if(!token) {
            return res.status(401).json({error : "Unauthorized: No token provided."});
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({ error : "Unauthorized: Invalid or expired token."});
    }
};
