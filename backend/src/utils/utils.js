import jwt from "jsonwebtoken";

export function getUserFromToken(req){
    const token = req.cookies?.token;

    if (!token) return null;

    try{
        const user = jwt.verify(token,process.env.JWT_SECRET); 
        return user;
    } catch (error){
        console.log(error);
        return null;
    }
}