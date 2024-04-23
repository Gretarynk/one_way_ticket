import jwt from "jsonwebtoken";

 export const auth=(req,res,next)=>{
    const token=req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"authorization failed"});
    }
    // console.log('token',token)
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:"authorization failed"})
        }
        // console.log('decoded token', decoded)
        req.body.userId=decoded.userId;
        // console.log('user id',req.body.userId)
        // req.user = decoded;
        // console.log('requested user',req.user)
        return next();
    });
}


 export const authForTicketPurchase = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Authorization failed: No token provided" });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded token to the request
        req.user = decoded;
        
        next();
    } catch (err) {
        return res.status(401).json({ message: "Authorization failed: Invalid token" });
    }
};

