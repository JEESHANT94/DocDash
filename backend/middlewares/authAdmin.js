import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        // ✅ Get token from "Authorization" header
        const token = req.headers.authorization?.split(" ")[1]; // Extract token properly

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized, Token Missing" });
        }

        // ✅ Decode token
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = token_decoded.userId; // Store userId in request object

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authUser;
