import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";


mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI).then(() => {
  console.log("Database is connected")
}).catch((err) => {
  console.log(err)
})
