import express, { Router } from "express";
import { User, Product, UserOTPVerification } from "../db/schema";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { serialize } from "cookie";
import cookieParser from "cookie-parser";
import { requireUserAuth, AuthenticatedRequest } from "../middleware/userauth";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const userrouter = express.Router();
const SECRET = process.env.SECRET || "";
userrouter.use(cookieParser());

interface UserOTPDetails {
  _id: mongoose.Types.ObjectId;
  email: string;
}

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPVerificationemail = async (
  { _id, email }: UserOTPDetails,
  res: Response
) => {
  try {
    console.log("Preparing OTP verification email...");
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete your sign up</p><p>The otp will expire in 1 hour</p> `,
    };

    console.log("Hashing OTP...");
    const hashedOTP = await bcrypt.hash(otp, 10);
    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    console.log("Saving OTP verification...");
    await newOTPVerification.save();

    console.log("Sending OTP verification email...");
    await transporter.sendMail(mailOptions);

    console.log("Sending OTP verification email success response...");
    res.json({
      status: "PENDING",
      message: "Verification OTP email sent ",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error: any) {
    console.error("Error sending OTP verification email:", error);
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

// const sendOTPVerificationemail=async({_id,email}:UserOTPDetails,res:Response)=>{
//     try {
//         const otp=`${Math.floor(1000+Math.random()*9000)}`;

//         const mailOptions={
//             from:process.env.EMAIL,
//             to:email,
//             subject:"Verify your email",
//             html:`<p>Enter <b>${otp}</b> in the app to verify your email address and complete your sign up</p><p>The otp will expire in 1 hour</p> `
//         };

//         const hashedOTP=await bcrypt.hash(otp,10);
//         const newOTPVerification=await new UserOTPVerification({
//             userId:_id,
//             otp:hashedOTP,
//             createdAt:Date.now(),
//             expiresAt:Date.now()+3600000,
//         })

//         await newOTPVerification.save();
//         await transporter.sendMail(mailOptions)
//         res.json({
//             status:"PENDING",
//             message:"Verification OTP email sent ",
//             data:{
//                 userId:_id,
//                 email
//             }
//         })
//     } catch (error:any) {
//         res.json({
//             status:"FAILED",
//             message:error.message,
//         })
//     }
// }

//user sign up
userrouter.post("/signup", async (req: AuthenticatedRequest, res: Response) => {
  const { username, email, password, ...otherstuff } = req.body;
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      console.log("User already exists");
      return res.status(403).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      ...otherstuff,
    });
    await newUser.save();

    console.log("Sending OTP verification email...");
    await sendOTPVerificationemail({ _id: newUser._id, email }, res);

    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "30d",
    });
    const serialized = serialize("userJWT", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/user",
    });
    res.setHeader("Set-Cookie", serialized);

    console.log("Sending success response...");
    // res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ msg: "Error occurred while signup" });
  }
});

//Verify OTP
userrouter.post(
  "/verifyOTP/:userId",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId }=req.params;
      const {  otp } = req.body;
      if (!userId || !otp) {
        res.status(403).json({ msg: "empty otp details are not allowed" });
      } else {
        const UserOTPVerificationrecords = await UserOTPVerification.find({
          userId,
        });
        if (UserOTPVerificationrecords.length <= 0) {
          res
            .status(403)
            .json({
              msg: "account record doesn't exist or has been verified already. Please Sign up",
            });
        } else {
          const { expiresAt } = UserOTPVerificationrecords[0];
          const hashedOTP = UserOTPVerificationrecords[0].otp;

          if (expiresAt && expiresAt.getTime() < Date.now()) {
            await UserOTPVerification.deleteMany({ userId });
            res
              .status(403)
              .json({ msg: "Code has expired . Please request again " });
          } else {
            if (hashedOTP) {
              const validOTP = await bcrypt.compare(otp, hashedOTP);
              if (!validOTP) {
                res
                  .status(403)
                  .json({ msg: "Invalid code passed, check your email" });
              }else{
                await User.updateOne({_id:userId},{verified:true})
                await UserOTPVerification.deleteMany({userId});
                res.json({
                    status:"VERIFIED",
                    message:"User email verified successfully"
                })
              }
            } else {
              res
                .status(403)
                .json({ msg: "Invalid code passed, check your email" });
            }
          }
        }
      }
    } catch (error:any) {
        res.json({
            status:"FAILED",
            message:error.message,
        })
    }
  }
);

//Resend OTP
userrouter.post("/resendOTP",async(req:AuthenticatedRequest,res:Response)=>{
    try {
        let {userId,email}=req.body
        if(!userId || !email){
            res.status(403).json({msg:"Empty user details are not allowed"})
        }else{
            await UserOTPVerification.deleteMany({userId});
            sendOTPVerificationemail({_id:userId,email},res)
        }
    } catch (error:any) {
        res.json({
          status: "FAILED",
          message: error.message,
        });
    }
})

// userrouter.post('/signup',async(req:AuthenticatedRequest,res:Response)=>{
//     const {username,email,password,...otherstuff}=req.body;
//      const user =await User.findOne({$or:[{username},{email}]});
//     try {

//         if(user){
//             res.status(403).json({msg:"User already exists"})
//         }else{
//             const hashedpassword=await bcrypt.hash(password,10);

//             const newUser=new User({username,email,password:hashedpassword,...otherstuff});
//             await newUser.save();

//             const token=jwt.sign({username,role:'user'},SECRET,{expiresIn: '30d' });

//             const serialised=serialize("userJWT",token,{
//                 httpOnly:true,
//                 sameSite:"strict",
//                 maxAge:60 * 60 * 24 * 30,
//                 path: "/user",

//             })

//             res.setHeader("Set-Cookie",serialised);
//             await sendOTPVerificationemail({ _id: newUser._id, email }, res);
//             res.status(200).json({msg:"User created successfully"});
//         }
//     } catch (error) {console.error("Error during user signup:", error);
//         res.status(404).json({msg:" error occured while signup"});
//     }

// })

//user login

userrouter.post("/login", async (req: AuthenticatedRequest, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (user.password) {
        const passwordverify = await bcrypt.compare(password, user.password);
        if (passwordverify) {
          const token = jwt.sign({ username, role: "user" }, SECRET, {
            expiresIn: "30d",
          });
          // const serialised=serialize("userJWT",token,{
          //     httpOnly:true,
          //     sameSite:"strict",
          //     maxAge:30*24*60*60,
          //     path:'/user'
          // })
          // res.setHeader("Set-Cookie",serialised);
          res.cookie("userJWT", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/",
          });
          // console.log('Response headers after login:', res.getHeaders());
          res.status(200).json({ msg: "User logged in successfully" });
        } else {
          res.status(403).json({ msg: "Invalid credentials" });
        }
      } else {
        res.status(403).json({ msg: "Password is not set for this user" });
      }
    } else {
      res.status(404).json({ msg: "user not found" });
    }
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(404).json({ msg: " error occured while login" });
  }
});

//user logout

userrouter.post("/logout", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cookies } = req;

    const jwt = cookies.userJWT;

    if (!jwt) {
      return res.json({ message: "Bro you are  not logged in..." });
    } else {
      const serialised = serialize("userJWT", "", {
        httpOnly: true,
        sameSite: "strict",
        maxAge: -1,
        path: "/",
      });

      res.setHeader("Set-Cookie", serialised);

      res.status(200).json({ message: "Successfuly logged out!" });

      // res.redirect('/');
    }
  } catch (error) {
    console.error("Error during user logout:", error);
    res.status(404).json({ msg: " error occured while logout" });
  }
});

//fetch all products

userrouter.get(
  "/getallproducts",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const products = await Product.find({});
      if (products) {
        res.json({ products });
      } else {
        res.status(403).json({ msg: "Could not fetch the products" });
      }
    } catch (error) {
      res
        .status(403)
        .json({ msg: "Error occurred while getting all products" });
    }
  }
);

//add product to bag

userrouter.post(
  "/addtobag/:productId",
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (product) {
        if (req.user) {
          const userac = await User.findOne({ username: req.user.username });
          if (userac) {
            if (userac.bag.includes(product._id)) {
              res
                .status(403)
                .json({ msg: "product already exists in the bag" });
            } else {
              try {
                userac.bag.push(product._id);
                await userac.save();
                res.json({ msg: "product added to bag successfully" });
              } catch (error) {
                console.error("Error while adding item to bag:", error);
              }
            }
          } else {
            res.status(403).json({ msg: "user not found" });
          }
        } else {
          res.status(403).json({ msg: "username not found " });
        }
      } else {
        res.status(403).json({ msg: "product not found" });
      }
    } catch (error) {
      res.json({ msg: "error adding product to bag" });
    }
  }
);

//remove product from bag
userrouter.post(
  "/removefrombag/:productId",
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (product) {
        if (req.user) {
          const userac = await User.findOne({ username: req.user.username });
          if (userac) {
            const indextodelete = userac.bag.indexOf(product._id);
            console.log(indextodelete);
            if (indextodelete !== -1) {
              userac.bag.splice(indextodelete, 1);
              await userac.save();
              res.json({ msg: "product removed from bag" });
            } else {
              res
                .status(403)
                .json({ msg: "unable to find index of the product" });
            }
          } else {
            res.status(403).json({ msg: "user not found" });
          }
        } else {
          res.status(403).json({ msg: "username not found " });
        }
      } else {
        res.status(403).json({ msg: "product not found" });
      }
    } catch (error) {
      res.json({ msg: "error deleting product from bag" });
    }
  }
);

//add product to wishlist
userrouter.post(
  "/addtowishlist/:productId",
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (product) {
        if (req.user) {
          const userac = await User.findOne({ username: req.user.username });
          if (userac) {
            userac.wishlist.push(product._id);
            await userac.save();
            res.json({ msg: "product added to wishlist successfully" });
          } else {
            res.status(403).json({ msg: "user not found" });
          }
        } else {
          res.status(403).json({ msg: "username not found " });
        }
      } else {
        res.status(403).json({ msg: "product not found" });
      }
    } catch (error) {
      res.json({ msg: "error adding product to wishlist" });
    }
  }
);

//remove product from wishlist
userrouter.post(
  "/removefromwishlist/:productId",
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (product) {
        if (req.user) {
          const userac = await User.findOne({ username: req.user.username });
          if (userac) {
            const indextodelete = userac.wishlist.indexOf(product._id);
            if (indextodelete !== -1) {
              userac.wishlist.splice(indextodelete, 1);
              await userac.save();
              res.json({ msg: "product removed from wishlist" });
            } else {
              res
                .status(403)
                .json({ msg: "unable to find index of the product" });
            }
          } else {
            res.status(403).json({ msg: "user not found" });
          }
        } else {
          res.status(403).json({ msg: "username not found " });
        }
      } else {
        res.status(403).json({ msg: "product not found" });
      }
    } catch (error) {
      res.json({ msg: "error deleting product from wishlist" });
    }
  }
);

//get user details
userrouter.get(
  "/getuserdetails",
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userac = await User.findOne({ username: req.user?.username });
      if (userac) {
        res.json({ userac });
      } else {
        res.status(403).json({ msg: "user  not found" });
      }
    } catch (error) {
      res.status(403).json({ msg: "error finding user details" });
    }
  }
);
//update user details

userrouter.post(
  "/updateusedetails",
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userac = await User.findOne({ username: req.user?.username });
      if (userac) {
        Object.assign(userac, req.body);
        await userac.save();
        res.json({ msg: "user details updated successfully" });
      } else {
        res.status(403).json({ msg: "user  not found" });
      }
    } catch (error) {
      res.status(403).json({ msg: "error updating user details" });
    }
  }
);

// order a product

//cancel order

export { userrouter };
