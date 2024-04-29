import { SlotBooking } from "../Models/slot.model.js";
import { ApiError } from "../Util/apierror.js";
import { ApiResponse } from "../Util/apiresponse.js";
import { asyncHandler } from "../Util/asynchandler.js";



const booking = asyncHandler(async(req,res)=>{
   const{name , mobile_no, Vehicle_no , Vehicle_type , time , stationName} =req.body
   console.log(name);

   if(
    [name , mobile_no, Vehicle_no , Vehicle_type , time , stationName].some((field)=>field?.trim() === "")
   ){
    throw new ApiError(400,"All fileds are required")
   }
    const slotBooked = await SlotBooking.findOne({
        $or:[{time}]
    })
     if(slotBooked){
        throw new ApiError(409,"The particular slot is reserved")
     }
     console.log(time);
     const reservedSlot = await SlotBooking.create({
        name,
        time,
        Vehicle_no,
        Vehicle_type,
        mobile_no,
        stationName
     })
    if(!reservedSlot){
        throw new ApiError(500,"something went wrong while reserving slot")
     } 
     return res.status(201).json(
        new ApiResponse(200,reservedSlot,"Slot Booked Successfully")
     )
})

export{booking}
