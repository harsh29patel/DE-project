import Mongoose,{Schema} from "mongoose";
const slotBookingSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    mobile_no:{
        type:Number,
        required:true
    },
    Vehicle_no:{
        type: String,
        required:true
    },
    Vehicle_type:{
        type:String,
    },
    time:{
        type:String,
        required:true
    },
    stationName:{
        type:String,
        required:true
    }

},{timestamps:true})
export const SlotBooking = Mongoose.model("SlotBooking",slotBookingSchema)