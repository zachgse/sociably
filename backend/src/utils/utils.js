import jwt from "jsonwebtoken";

export function getUserFromToken(req){
    const accessToken = req.headers.authorization?.split(' ')[1]; 

    if (!accessToken) return null;

    try{
        const user = jwt.verify(accessToken,process.env.JWT_SECRET); 
        return user;
    } catch (error){
        console.log(error);
        return null;
    }
}