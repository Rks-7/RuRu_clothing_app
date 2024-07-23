import express from "express";
import {Admin,Order,Product, User} from "../db/schema";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import {Request,Response} from 'express'
import { serialize } from "cookie";
import cookieParser from 'cookie-parser';
import {requireAdminAuth,AuthenticatedRequest} from "../middleware/adminauth";
import bcrypt from "bcrypt";



const adminrouter =express.Router();
const SECRET = process.env.SECRET || "";
adminrouter.use(cookieParser());

//admin sign up

adminrouter.post(
  "/signup",
  async (req: AuthenticatedRequest, res: Response) => {
    const { username, password, email } = req.body;

    try {
      const admin = await Admin.findOne({ username });
      if (admin) {
        res.status(403).json({ msg: "Admin already exists" });
      } else {
        const hashedpassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
          username,
          password: hashedpassword,
          email,
        });
        await newAdmin.save();
        const token = jwt.sign({ username, role: "admin" }, SECRET, {
          expiresIn: "30d",
        });

        res.cookie("userJWT", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          path: "/",
        });

        res.status(200).json({ msg: "Admin created successfully" });
      }
    } catch (error) {
      console.error("Error during admin signup:", error);
      res.status(404).json({ msg: " error occured while signup" });
    }
  }
);

//admin login

adminrouter.post("/login", async (req: AuthenticatedRequest, res: Response) => {
  const { username,email, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin) {
      if (admin.password) {
        const passwordverify = await bcrypt.compare(password, admin.password);

        if (passwordverify) {
          const token = jwt.sign({ username, role: "admin" }, SECRET, {
            expiresIn: "30d",
          });
          res.cookie("adminJWT", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/",
          });
          // console.log('Response headers after login:', res.getHeaders());
          res.status(200).json({ msg: "Admin logged in successfully" });
        } else {
          res.status(403).json({ msg: "Invalid credentials" });
        }
      } else {
        res.status(403).json({ msg: "Password is not set for this admin" });
      }
    }else{
        res.status(404).json({msg:"Admin cannot be found"});
    }
  } catch (error) {
    console.error("Error during admin signup:", error);
    res.status(404).json({ msg: " error occured while login" });
  }
});

//admin logout 

adminrouter.post('/logout',async(req:Request,res:Response)=>{
    
    try {
        res.clearCookie('adminJWT');
        // console.log('Response headers after logout:', res.getHeaders());
         res.status(200).json({msg:"Admin logged out successfully"});
    } catch (error) {
         console.error("Error during admin logout:", error);
        res.status(404).json({msg:" error occured while logout"});
        res.redirect('/');
    }
    
})

//add a product to inventory

adminrouter.post('/addproduct',requireAdminAuth,async(req:AuthenticatedRequest,res:Response)=>{
    const {productname,category,color,gender}=req.body;
    
    try {
        const product=await Product.findOne({productname,category,color,gender});

        if(!product){
        const newprod=new Product(req.body);
        await newprod.save();
        res.json({message:"product added to inventory successfully" });

    }else{
        res.status(403).json({msg:"Product already exists in inventory",productname});
    }
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
})

//delete a product from inventory 
adminrouter.post('/deleteproduct/:productId',requireAdminAuth,async(req:Request,res:Response)=>{
    try {
        const product=await Product.findByIdAndDelete(req.params.productId);
        if(product){
            res.json({msg:"product deleted successfully"});
        }else{
            res.status(403).json({msg:"product not found"});
        }
    } catch (error) {
        res.status(403).json({msg:"Error occurred while deleting product"});
    }
})

// fetch all orders

adminrouter.get('/allorders',requireAdminAuth,async(req:AuthenticatedRequest,res:Response)=>{
    
    try {
        const orders=await Order.find({});
        res.json({orders});
    } catch (error) {
        res.status(403).json({msg:"Error occurred while getting all orders"});
    }
})

//fetch a specific users order

adminrouter.get('/allorders/:user',requireAdminAuth,async(req:Request,res:Response)=>{
    try {
        const orders=await Order.find({orderowner:req.params.user});
        if(orders){
            res.json({orders});
        }else{
            res.status(403).json({msg:"no orders found"});
        }
    } catch (error) {
            res.status(403).json({msg:"error occured while fetching users order"});
    }}
)

//update users order details

adminrouter.post('/editorder/:orderId',requireAdminAuth,async(req:AuthenticatedRequest,res:Response)=>{
    try {
        const order=await Order.findByIdAndUpdate(req.params.orderId,req.body,{new:true});
        if(order){
            res.json({msg:"order updated successfully"});
        }else{
            res.status(403).json({msg:"no such order found"});
        }
    } catch (error) {
        res.status(403).json({msg:"error occured while updating order"});
    }
})

//get all users 
adminrouter.get('/allusers',requireAdminAuth,async(req:Request,res:Response)=>{
    try {
        const users=await User.find({});
        if(users){
            res.json({msg:"users found successfully"});
        }else{
            res.status(403).json({msg:"No users found"});
        }
    } catch (error) {
        res.status(403).json({msg:"Error finding users"});
    }
})

//delete user
adminrouter.post('/deleteuser/:userId',requireAdminAuth,async(req:Request,res:Response)=>{
    try {
        const user=await User.findByIdAndDelete(req.params.userId);
        if(user){
            res.json({msg:"user deleted successfully"});
        }else{
            res.status(403).json({msg:"No user to delete"});
        }
    } catch (error) {
        res.status(403).json({msg:"user deletion failed"});

    }
})

export{adminrouter}