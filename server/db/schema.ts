import mongoose from 'mongoose';


const adminSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
})

const reviewSchema=new mongoose.Schema({
    username:String,
    productimg:[String],
    review:String
})

const productSchema=new mongoose.Schema({
    productname:String,
    category:String,
    count:Number,
    productimg:[String],
    gender:String,
    colour:String,
    price:Number,
    size:String,
    rating :Number,
    reviews:[reviewSchema],
})

const orderSchema=new mongoose.Schema({
    orderedproducts:[productSchema],
    quantity:Number,
    orderowner:String,
    paid:String,
    deliveryadr:String,
    Tracking :String,
    

})
const addressSchema=new mongoose.Schema({
    pincode:Number,
    state:String,
    address:String,
    town:String,
    city_district:String
})

const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    mobileno:Number,
    address:[addressSchema],
    password:String,
    gender:String,
    verified:Boolean,
    bag:[{type: mongoose.Schema.Types.ObjectId, ref:'Product'}],
    wishlist:[{type: mongoose.Schema.Types.ObjectId, ref:'Product'}]

})

const UserOTPVerificationSchema=new mongoose.Schema({
    userId:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date,
});

const UserOTPVerification=mongoose.model('UserOTPVerification',UserOTPVerificationSchema)
const User=mongoose.model('User',userSchema);
const Admin=mongoose.model('Admin',adminSchema);
const Order=mongoose.model('Order',orderSchema);
const Product=mongoose.model('Product',productSchema);

export{
    User,
    Admin,
    Order,
    Product,
    UserOTPVerification
}


