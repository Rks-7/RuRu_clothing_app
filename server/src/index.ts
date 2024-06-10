import express from "express";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import {adminrouter} from '../routes/admin';
import {userrouter} from "../routes/user"
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

mongoose.set("strictQuery", false);

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend address
    credentials: true
}));
app.use(express.json());

app.use('/admin',adminrouter);
app.use('/user',userrouter);



const MONGODB_URI=process.env.MONGODB_URI || '';

console.log(`mongo url-> ${MONGODB_URI}`);


interface ExtendedConnectionOptions extends mongoose.ConnectOptions{
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
  dbName:string;
}
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "ecommerce",
} as ExtendedConnectionOptions);

const PORT = process.env.BPORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
