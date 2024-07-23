import express, { Router } from "express";
import { User, Product, UserOTPVerification,UsermobileOTPverification,Order } from "../db/schema";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { serialize } from "cookie";
import cookieParser from "cookie-parser";
import { requireUserAuth, AuthenticatedRequest } from "../middleware/userauth";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio"
import mongoose from "mongoose";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";

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


const accountSid=process.env.accountSid;
const authToken= process.env.authToken;


const client=new twilio.Twilio(accountSid,authToken);

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


//format mobile no 

function formatPhoneNumber(phoneNumber:string, countryCode: CountryCode = 'IN') {

  const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
  return parsedNumber ? parsedNumber.format("E.164") : null;
}

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
    

    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "30d",
    });
    // const serialized = serialize("userJWT", token, {
    //   httpOnly: true,
    //   sameSite: "strict",
    //   maxAge: 60 * 60 * 24 * 30,
    //   path: "/user",
    // });
    // res.setHeader("Set-Cookie", serialized);
      res.cookie("userJWT", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: "/",
      });

    await sendOTPVerificationemail({ _id: newUser._id, email }, res);
    console.log("Sending success response...");
    // res.status(200).json({ msg: "User created successfully" });
  } catch (error:any) {
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
  } catch (error:any) {
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
  } catch (error:any) {
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
    } catch (error:any) {
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
            const bagItem = userac.bag.find((item) =>
              item.prod?.equals(product._id)
            );
            if (bagItem) {
              res
                .status(403)
                .json({ msg: "product already exists in the bag" });
            } else {
              try {
                userac.bag.push({ prod: product._id, quantity: 1 });
                await userac.save();
                res.json({ msg: "product added to bag successfully" });
              } catch (error:any) {
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
    } catch (error:any) {
      res.json({ msg: "error adding product to bag" });
    }
  }
);


//remove product from bag
// userrouter.post(
//   "/removefrombag/:productId",
//   requireUserAuth,
//   async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       const product = await Product.findById(req.params.productId);
//       if (product) {
//         if (req.user) {
//           const userac = await User.findOne({ username: req.user.username });
//           if (userac) {
//             const indextodelete = userac.bag.indexOf(product._id);
//             console.log(indextodelete);
//             if (indextodelete !== -1) {
//               userac.bag.splice(indextodelete, 1);
//               await userac.save();
//               res.json({ msg: "product removed from bag" });
//             } else {
//               res
//                 .status(403)
//                 .json({ msg: "unable to find index of the product" });
//             }
//           } else {
//             res.status(403).json({ msg: "user not found" });
//           }
//         } else {
//           res.status(403).json({ msg: "username not found " });
//         }
//       } else {
//         res.status(403).json({ msg: "product not found" });
//       }
//     } catch (error:any) {
//       res.json({ msg: "error deleting product from bag" });
//     }
//   }
// );

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
    } catch (error:any) {
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
    } catch (error:any) {
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
    } catch (error:any) {
      res.status(403).json({ msg: "error finding user details" });
    }
  }
);
//update user details

userrouter.post(
  "/updateuserdetails",
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const{mobileno,email}=req.body;
      const userac = await User.findOne({ username: req.user?.username });
      if (userac) {
        const userwithmob = await User.findOne({
          mobileno: mobileno,
          username: { $ne: req.user?.username },
        });
        if(userwithmob){
          res.status(403).json({msg:"user with this mobile already exists"})
        }else{
          const userwithemail = await User.findOne({
            email: email,
            username: { $ne: req.user?.username },
          });
          if(userwithemail){
            res.status(403).json({msg:"user with this email already exists"})
          }
        }
        


        await User.findOneAndUpdate(
          { username: req.user?.username },
          req.body,
          { new: true } // This option returns the modified document
        );
        await userac.save();
        res.json({ msg: "user details updated successfully" });
      } else {
        res.status(403).json({ msg: "user  not found" });
      }
    } catch (error:any) {
      res.status(403).json({ msg: "error updating user details" });
    }
  }
);

//user mobile otp generation

userrouter.post("/sendmobileotp", requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
  try {
    const { mobileno, id } = req.body;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const formattedPhoneNumber = formatPhoneNumber(mobileno);
    if (!formattedPhoneNumber) {
      return res.json({
        status: "FAILED",
        message: "Invalid phone number format",
      });
    }

    const hashedOTP = await bcrypt.hash(otp, 10);
    const newOTPVerification = new UsermobileOTPverification({
      userId: id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await newOTPVerification.save();

    await client.messages.create({
      body: `Your OTP for Ruru is ${otp} and will expire in 1 hour`,
      from: process.env.phn_no,
      to: formattedPhoneNumber,
    });

    res.json({
      status: "PENDING",
      message: "Verification OTP mobileno sent ",
      data: {
        userId: id,
        mobileno,
      },
    });
  } catch (error:any) {
    console.error("Error sending OTP verification mobileno:", error);
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
  
  
});

//verify mobile otp

userrouter.post(
  "/verifymobileOTP/:userId/:mobileno",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId,mobileno } = req.params;
      const { otp } = req.body;
      if (!userId || !otp) {
        res.status(403).json({ msg: "empty otp details are not allowed" });
      } else {
        const UserOTPVerificationrecords = await UsermobileOTPverification.find({
          userId,
        });
        if (UserOTPVerificationrecords.length <= 0) {
          res.status(403).json({
            msg: "account record doesn't exist or has been verified already. Please Sign up",
          });
        } else {
          const { expiresAt } = UserOTPVerificationrecords[0];
          const hashedOTP = UserOTPVerificationrecords[0].otp;

          if (expiresAt && expiresAt.getTime() < Date.now()) {
            await UsermobileOTPverification.deleteMany({ userId });
            res
              .status(403)
              .json({ msg: "Code has expired . Please request again " });
          } else {
            if (hashedOTP) {
              const validOTP = await bcrypt.compare(otp, hashedOTP);
              if (!validOTP) {
                res
                  .status(403)
                  .json({ msg: "Invalid code passed, check your mobile" });
              } else {
                 await User.findOneAndUpdate(
                   { _id: userId },
                   {
                     $set: {
                       verifiedmobile: true,
                       mobileno: mobileno,
                     },
                   },
                   { new: true } // This option returns the updated document
                 );
                await UserOTPVerification.deleteMany({ userId });
                res.json({
                  status: "VERIFIED",
                  message: "User mobile number verified successfully",
                });
              }
            } else {
              res
                .status(403)
                .json({ msg: "Invalid code passed, check your mobileno" });
            }
          }
        }
      }
    } catch (error: any) {
      res.json({
        status: "FAILED",
        message: error.message,
      });
    }
  }
);



//resend mobile otp
//Resend OTP
userrouter.post("/resendmobileOTP",async(req:AuthenticatedRequest,res:Response)=>{
    try {
        let {userId,mobileno}=req.body
        if(!userId || !mobileno){
            res.status(403).json({msg:"Empty user details are not allowed"})
        }else{
            await UsermobileOTPverification.deleteMany({userId});
              try {
                const { mobileno, id } = req.body;
                const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

                const hashedOTP = await bcrypt.hash(otp, 10);
                const newOTPVerification = new UsermobileOTPverification({
                  userId: id,
                  otp: hashedOTP,
                  createdAt: Date.now(),
                  expiresAt: Date.now() + 3600000,
                });
                await newOTPVerification.save();

                await client.messages.create({
                  body: `Your OTP for Ruru is ${otp} and will expire in 1 hour`,
                  from: "+919136712549",
                  to: mobileno,
                });

                res.json({
                  status: "PENDING",
                  message: "Verification OTP mobileno sent ",
                  data: {
                    userId: id,
                    mobileno,
                  },
                });
              } catch (error:any) {
                console.error(
                  "Error sending OTP verification mobileno:",
                  error
                );
                res.json({
                  status: "FAILED",
                  message: error.message,
                });
              }
        }
    } catch (error:any) {
        res.json({
          status: "FAILED",
          message: error.message,
        });
    }
})

// get products from bag

userrouter.get('/getbag', requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
  try {
      const user = await User.findOne({
        username: req.user?.username,
      }).populate({
        path: "bag.prod",
        model: "Product",
      });
      if (user) {
          res.json({bag : user.bag || []})
      }else{
        res.status(403).json({ message: "User not found" });
      }
  } catch (error) {
    res.status(403).json({msg:"couldnt load the bag"})
  }
  

})
// order a product

userrouter.post('/addorder',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
  try {

    const {bag}=req.body;

    const user = await User.findOne({ username: req.user?.username }).populate({
      path: "bag.prod",
      model: "Product",
    });
    if(user){
      user.set("bag", bag);
      await user.save();

      if (user.bag.length == 0) res.status(400).json({ msg: "Bag is empty" });
      
      
        const orderdel = await Order.deleteMany({
          $and: [{ orderowner: req.user?.username }, { paid: "NO" }],
        });
        if(orderdel){
          console.log("order deleted successfully");
        }else{
          console.log("no order found to delete");
        }
    
      let totalamount = 0;
      for (const bagItem of user.bag) {
        if (bagItem.prod && (bagItem.prod as any).price && bagItem.quantity) {
          totalamount += (bagItem.prod as any).price * bagItem.quantity;
        }
      }

      const orders:any=[];
      for(const bagItem of user.bag){
        const newOrder = new Order({
          orderedproduct: bagItem.prod,
          quantity: bagItem.quantity,
          orderowner: user.username,
          ordertotal:totalamount,
          paid: "NO", 
          deliveryadr: req.body.deliveryadr, 
          Tracking: "Pending", 
          placed: true,
        });
        const savedOrder=await newOrder.save();
        orders.push(savedOrder);
      }

      // user.set("bag", []);
      // await user.save();

      res.json({msg:"Order placed successfully",orders});

    }else{
      res.status(403).json({msg:"user not found"})
    }
  } catch (error) {
    res.status(500).json({ msg: "Couldn't place the orders", error });
  }
  

})

//get order details 

userrouter.get('/getorderdetails',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
  try {
      const orders = await Order.find({ $and: [{ orderowner:req.user?.username }, { paid:"NO" }] });
      if(orders){
        res.json({msg:"Order found successfully",orders});
      }else{
        res.status(403).json({msg:"Orders not found"})
      }
  } catch (error) {
    console.log(error);
  }
})

userrouter.get(
  "/allorders",
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await Order.find({
        $and: [{ orderowner: req.user?.username }, { paid: "YES" }],
      });
      if (orders) {
        res.json({ msg: "Order found successfully", orders });
      } else {
        res.status(403).json({ msg: "Orders not found" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

//get singleorder

userrouter.get('/singleorder/:orderId',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
  try {
    const {orderId}=req.params;
    const order=await Order.findById(
      orderId
    )

    if(order){
      res.json({msg:"Order found successfully",order})
    }else{
      res.json({msg:"Order not found"});
    }
  } catch (error) {
    console.log(error)
  }
})

//cancel order

export { userrouter };
