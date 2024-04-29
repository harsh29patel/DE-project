import dotenv from "dotenv";
import connectDB from "./DB/index.js";
import { app } from "./app.js";





dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT|| 5000,()=>{
        console.log(`server is running on port :${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log('Mongo db Connection failed');
})