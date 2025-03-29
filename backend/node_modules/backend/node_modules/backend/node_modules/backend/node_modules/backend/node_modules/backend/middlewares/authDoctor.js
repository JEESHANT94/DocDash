import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
    try {
       
        const dToken = req.headers.authorization?.split(" ")[1];
        
        if (!dToken) {
            return res.status(401).json({ success: false, message: "Unauthorized, Token Missing" });
        }

      
        const dToken_decoded = jwt.verify(dToken, process.env.JWT_SECRET);
        
        console.log("Decoded Token:", dToken_decoded); // Debugging log

        req.doctorId = dToken_decoded.doctorId; // Ensure this line correctly sets the userId

        console.log("Stored Doctor ID in req.docId:", req.doctorId); // Debugging log

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authDoctor;
