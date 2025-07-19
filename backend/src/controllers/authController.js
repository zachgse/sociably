import dotenv from 'dotenv';
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

async function verifyGoogleToken(token){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.OAUTH_CLIENT_ID
    });

    const payload = ticket.getPayload();
    return payload;
}

export async function auth (req,res){
    const {credential} = req.body;

    //verify payload and token
    const payload = await verifyGoogleToken(credential);
    const {name,email,picture} = payload; //extract data from payload returned from my other function

    //check if email is a user already in the system
    var user = await User.findOne({email});
    if (!user){
        user = new User({
            name,
            email,
            picture,
            status: "active",
            role: "user",
            provider: "google",
        });
        
        await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Set token in HttpOnly cookie
    res.cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // true in prod
        sameSite: 'Strict', // or 'Lax' if needed for login forms
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    // Return only user info (no token in JSON)
    return res.status(200).json({
        user: {
            name: user.name,
            email: user.email,
            picture: user.picture
        }
    });
}

export async function checkAuth (req,res){
    const token = req.cookies.token;

    if (!token) return res.status(401).json({message:"No token"});

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            user: {
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });
    } catch (error) {
        return res.status(403).json({message:"Invalid token"});
    }
}

export async function logout(req,res){
    res.clearCookie('token', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // true in prod
        sameSite: 'Strict',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
}