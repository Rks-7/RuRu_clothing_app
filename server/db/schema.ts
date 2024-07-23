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
    productname:String,//
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

const addressSchema = new mongoose.Schema({
  pincode: Number,
  state: String,
  address: String,
  town: String,
  city_district: String,
});

const orderSchema=new mongoose.Schema({
    orderedproduct:productSchema,
    quantity:Number,
    orderowner:String,
    ordertotal:Number,
    paid:String,
    deliveryadr:addressSchema,
    Tracking :String,
    placed:Boolean
    

})


const bagSchema = new mongoose.Schema({
  prod: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity:Number
});

const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    mobileno:String,
    address:[addressSchema],
    password:String,
    gender:String,
    verified:Boolean,
    verifiedmobile:Boolean,
    bag:[bagSchema],
    wishlist:[{type: mongoose.Schema.Types.ObjectId, ref:'Product'}]

})

const UserOTPVerificationSchema=new mongoose.Schema({
    userId:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date,
});

const UsermobileOTPverificationSchema = new mongoose.Schema({
  userId: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const UserOTPVerification=mongoose.model('UserOTPVerification',UserOTPVerificationSchema)
const UsermobileOTPverification=mongoose.model('UsermobileOTPVerification',UsermobileOTPverificationSchema)
const User=mongoose.model('User',userSchema);
const Admin=mongoose.model('Admin',adminSchema);
const Order=mongoose.model('Order',orderSchema);
const Product=mongoose.model('Product',productSchema);

export {
  User,
  Admin,
  Order,
  Product,
  UserOTPVerification,
  UsermobileOTPverification,
};


