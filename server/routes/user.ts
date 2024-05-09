import express from "express";
import {User,Product} from "../db/schema";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import {Request,Response} from 'express'
import { serialize } from "cookie";
import cookieParser from 'cookie-parser';
import {requireUserAuth,AuthenticatedRequest }from "../middleware/userauth";
import bcrypt from "bcrypt"


const userrouter =express.Router();
const SECRET = process.env.SECRET || "";
userrouter.use(cookieParser());

//user sign up
userrouter.post('/signup',async(req:AuthenticatedRequest,res:Response)=>{
    const {username,email,password,...otherstuff}=req.body;
     const user =await User.findOne({$or:[{username},{email}]});
    try {
       
        if(user){
            res.status(403).json({msg:"User already exists"})
        }else{
            const hashedpassword=await bcrypt.hash(password,10);

            const newUser=new User({username,email,password:hashedpassword,...otherstuff});
            await newUser.save();
            const token=jwt.sign({username,role:'user'},SECRET,{expiresIn: '30d' });

            const serialised=serialize("userJWT",token,{
                httpOnly:true,
                sameSite:"strict",
                maxAge:60 * 60 * 24 * 30,
                path: "/user",

            })

            res.setHeader("Set-Cookie",serialised);
            res.status(200).json({msg:"User created successfully"});
        }
    } catch (error) {console.error("Error during user signup:", error);
        res.status(404).json({msg:" error occured while signup"});
    }
    
})

//user login

userrouter.post('/login',async(req:AuthenticatedRequest,res:Response)=>{
    const {username ,email,password}=req.body;
    try {
        const user =await User.findOne({email});
    if(user){
        if(user.password){
        
            const passwordverify=await bcrypt.compare(password,user.password);
        if(passwordverify){
        const token =jwt.sign({username,role:"user"},SECRET,{expiresIn:'30d'});
        const serialised=serialize("userJWT",token,{
            httpOnly:true,
            sameSite:"strict",
            maxAge:30*24*60*60,
            path:'/user'
        })
        res.setHeader("Set-Cookie",serialised);
        // console.log('Response headers after login:', res.getHeaders());
        res.status(200).json({msg:"User logged in successfully"});
    }else{
        res.status(403).json({ msg: "Invalid credentials" });
    }
    }else{
        res.status(403).json({ msg: "Password is not set for this user" });
    }
    }
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(404).json({msg:" error occured while login"});
    }
    

})

//user logout 

userrouter.post('/logout',async(req:AuthenticatedRequest,res:Response)=>{
    
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
        res.status(404).json({msg:" error occured while logout"});
    }
    
})





//add product to bag

userrouter.post('/addtobag/:productId',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
    try {
        const product=await Product.findById(req.params.productId);
        if(product){
            if(req.user){
            const userac =await User.findOne({username:req.user.username});
            if(userac){
                if(userac.bag.includes(product._id)){
                    res.status(403).json({msg:"product already exists in the bag"});
                }else{

                    try {
                        userac.bag.push(product._id);
                        await userac.save()
                        res.json({msg:"product added to bag successfully"});
                    } catch (error) {
                         console.error("Error while adding item to bag:", error);
                    }
                    
                
                }
                
            }else{
                res.status(403).json({msg:"user not found"});
            }
        }else{
            res.status(403).json({msg:"username not found "});
        }
        }else{
            res.status(403).json({msg:"product not found"});
        }
    } catch (error) {
        res.json({msg:"error adding product to bag"});
    }
})

//remove product from bag
userrouter.post('/removefrombag/:productId',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
    try {
        const product=await Product.findById(req.params.productId);
        if(product){
            if(req.user){
            const userac =await User.findOne({username:req.user.username});
            if(userac){
                const indextodelete=userac.bag.indexOf(product._id);
                console.log(indextodelete);
                if(indextodelete!==-1){
                    userac.bag.splice(indextodelete,1);
                    await userac.save();
                    res.json({msg:"product removed from bag"});
                }else{
                    res.status(403).json({msg:"unable to find index of the product"});
                }
                
            }else{
                res.status(403).json({msg:"user not found"});
            }
        }else{
            res.status(403).json({msg:"username not found "});
        }
        }else{
            res.status(403).json({msg:"product not found"});
        }
    } catch (error) {
        res.json({msg:"error deleting product from bag"});
    }
})

//add product to wishlist 
userrouter.post('/addtowishlist/:productId',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
    try {
        const product=await Product.findById(req.params.productId);
        if(product){
            if(req.user){
            const userac =await User.findOne({username:req.user.username});
            if(userac){
                userac.wishlist.push(product._id);
                await userac.save();
                res.json({msg:"product added to wishlist successfully"});
            }else{
                res.status(403).json({msg:"user not found"});
            }
        }else{
            res.status(403).json({msg:"username not found "});
        }
        }else{
            res.status(403).json({msg:"product not found"});
        }
    } catch (error) {
        res.json({msg:"error adding product to wishlist"});
    }
})

//remove product from wishlist
userrouter.post('/removefromwishlist/:productId',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
    try {
        const product=await Product.findById(req.params.productId);
        if(product){
            if(req.user){
            const userac =await User.findOne({username:req.user.username});
            if(userac){
                const indextodelete=userac.wishlist.indexOf(product._id);
                if(indextodelete!==-1){
                    userac.wishlist.splice(indextodelete,1);
                    await userac.save();
                    res.json({msg:"product removed from wishlist"});
                }else{
                    res.status(403).json({msg:"unable to find index of the product"});
                }
                
            }else{
                res.status(403).json({msg:"user not found"});
            }
        }else{
            res.status(403).json({msg:"username not found "});
        }
        }else{
            res.status(403).json({msg:"product not found"});
        }
    } catch (error) {
        res.json({msg:"error deleting product from wishlist"});
    }
})

//get user details
userrouter.get('/getuserdetails',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
    try {
        const userac=await User.findOne({username:req.user?.username});
    if(userac){
        res.json({userac});
    }else{
        res.status(403).json({msg:"user  not found"})
    }
    } catch (error) {
        res.status(403).json({msg:"error finding user details"})
    }
    
})
//update user details

userrouter.post('/updateusedetails',requireUserAuth,async(req:AuthenticatedRequest,res:Response)=>{
    try {
        const userac=await User.findOne({username:req.user?.username});
    if(userac){
       Object.assign(userac,req.body);
       await userac.save();
       res.json({msg:"user details updated successfully"});
    }else{
        res.status(403).json({msg:"user  not found"})
    }
    } catch (error) {
        res.status(403).json({msg:"error updating user details"})
    }

})

// order a product 

//cancel order 




export{userrouter}