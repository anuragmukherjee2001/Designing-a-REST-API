import mongoose from "mongoose";

const refreshTokenSchema = mongoose.Schema({
    token:{
        type:String,
        unique:true
    }
},{timestamps:false});

export default mongoose.model("RefreshTokenSchema", refreshTokenSchema);