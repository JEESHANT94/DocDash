import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
       
        const token = req.headers.token;
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized, Token Missing" });
        }

      
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log("Decoded Token:", token_decoded); // Debugging log

        req.userId = token_decoded.userId; // Ensure this line correctly sets the userId

        console.log("Stored User ID in req.userId:", req.userId); // Debugging log

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authUser;
