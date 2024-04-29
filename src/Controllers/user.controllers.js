import { application } from "express";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Util/apierror.js";
import { ApiResponse } from "../Util/apiresponse.js";
import { asyncHandler } from "../Util/asynchandler.js";

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler(async(req,res)=>{
    
    const{fullname,email,password,username}=req.body

    if(
        [fullname,email,password,username].some((field)=>field?.trim() === "")
    )
       { throw new ApiError(400,"all fields are required")}
        const existedUser = await User.findOne({
            $or:[{username},{email}]
        })
        if(existedUser){
            throw new ApiError(409,"User with email or Username already exists")
        }

        const user =  await User.create({
            fullname,
            email,
            password,
            username: username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering User")
        }

        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registeres successfully")
        )
})


const loginUser = asyncHandler(async(req,res)=>{


    const {email,username,password}=req.body
    console.log(email);

    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Password is incorrect")
    }
    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken")// optional steps
    console.log(loggedInUser);

    const options = {
        httpOnly:true,
        secure:true
    }

    return  res.status(200).cookie("accessToken" , accessToken , options).cookie("refreshToken" , refreshToken , options).json(
        new ApiResponse(
            200,
            {
                user:loggedInUser , accessToken , refreshToken
            },
            "User logged in successfully"
        )
    )
})

export { registerUser,
         loginUser,
         }