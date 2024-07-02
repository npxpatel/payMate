const jwt = require("jsonwebtoken");
const jwtKey=require("../config");

function userMiddleware(req,res,next){
     const authHeader=req.headers.authorization;
     if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(403).json({
            msg:"Auth failed 1",
        })
     }

     const words=authHeader.split(' ');
     const jwtToken=words[1];

     try{
     const decodedPayload=jwt.verify(jwtToken,jwtKey);
      if(decodedPayload.user_id){
        req.user_id=decodedPayload.user_id;
        next();
      }
      else  {
        res.status(403).json({ 
            msg:"Auth failed 2",
            decoded:decodedPayload,
        })
      } 
     }

     catch(error){
        res.json({
            msg:"Invalid token/expired",
        })
     } 


}

module.exports={
    userMiddleware,
}