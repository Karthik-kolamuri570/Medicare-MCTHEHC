const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const appointmentSchema=new Schema({
    doctorId:{
        type:Schema.Types.ObjectId,
        ref:'Doctor',
        required:[true,"Doctor Id is required"]
    },
    patientId:{
        type:Schema.Types.ObjectId,
        ref:'Patient',
        required:[true,"Patient Id is required"]
    },
    problem:{
        type:String,
        required:[true,"Problem is required"]
    },
    specialization:{
        type:String,
        required:[true,"Specialization is required"]
    },
    date:{
        type:String,
        required:[true,"Date is required"],
        // validate:{
        //     validator:function(date){
        //         return date.match(/^\d{4}-\d{2}-\d{2}$/);
        //         },
        //         message:"Invalid date"
        // }
    },
    time:{
        type:String,
        required:[true,"Time is required"],
        // validate:{
        //     validator:function(time){
        //         return time.match(/^(0?[1-9]|1[0-2]):[0-59](:?\.[0-5][0-9])?$|24:00$/);
        //         },
        //         message:"Invalid time"
        // }
    },
    paymentStatus:{
        type:String,
        default:"unpaid",
    },
    status:{
        type:String,
        default:"Pending"
    },
})
module.exports=new mongoose.model('appointment',appointmentSchema);