import dotenv from 'dotenv';
import User from "../models/User.js";
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

function generateToken(payload,type){
    const expiry = type == 'access' ? '15m' : '7d';
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn:expiry}
    );
    return token;
}

export async function auth (req,res){ //login
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

    const userPayload = {id:user._id,email:user.email};

    const refreshToken = generateToken(userPayload,'refresh');
    const accessToken = generateToken(userPayload,'access');

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // true in prod
        sameSite: 'Strict', // or 'Lax' if needed for login forms
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });
        
    return res.status(200).json({
        user: {
            name: user.name,
            email: user.email,
            picture: user.picture
        },
        accessToken:accessToken
    });
}

export async function checkAuth (req,res){ //checks access token
    const accessToken = req.headers.authorization?.split(' ')[1]; 

    if (!accessToken) return res.status(403).json({message:"Unauthorized"}); //this will trigger refresh interceptor

    try {
        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            user: {
                id : user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            },
            accessToken:accessToken
        });
    } catch (error) {
        return res.status(403).json({message:"Invalid token"});
    }
}

export async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: "You are logged out" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newAccessToken = generateToken(
      { id: user._id, email: user.email },
      'access'
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (err) {
    return res.status(403).json({ msg: "Invalid refresh token" });
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