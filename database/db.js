import mongoose from "mongoose";

export default async ()=>{
    await mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('connected to mongodb');
    }).catch(err => console.log(err));
}
