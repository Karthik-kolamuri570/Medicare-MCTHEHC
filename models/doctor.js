const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    contact:{
        type:String,
        required:[true,"Contact is required"],
        validate:{
            validator:function(value){
                return value.length==10 && value.isMobilePhone
            },
            message:"Contact should be of 10 digits"
        }
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email should be unique"],
        validate:{
            validator:function(value){
                return value.isEmail
            },
            message:"Email should be valid"
        }
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Password should be of minimum 8 characters"]
    },
    specialization:{
        type:String,
        required:[true,"Specialization is required"]
    },
    experience:{
        type:Number,
        required:[true,"Experience is required"],
        validate:{
            validator:function(value){
                return value>0
            },
            message:"Experience should be greater than 0"
        }
    },
    hospital:{
        type:String,
        required:[true,"Hospital is required"]
    },
    feePerConsultation:{
        type:Number,
        required:[true,"Fee per consultation is required"],
        validate:{
            validator:function(value){
                return value>0
            },
            message:"Fee per consultation should be greater than 0"
        }
    },
    fromTime: {
        type: String,
        required: [true, "Please provide your from time"],
    },
    toTime: {
        type: String,
        required: [true, "Please provide your to time"],
    },
    status: {
        type: String,
        default: "pending",
    },  
    unseenNotifications:{
        type:Array,
        default:[]
    },
    seenNotifications:{
        type:Array,
        default:[]
    }
})