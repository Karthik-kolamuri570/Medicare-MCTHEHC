const Patient = require('../models/patient');
const Doctor=require('../models/doctor');
const Appointment=require('../models/appointments');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
exports.registerPatient = async (req, res) => {
    try {
        console.log('Under Register Patient Controller');
        
        const { name, email, password, contact, age, gender, address } = req.body;
        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: "Patient already exists"
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new patient
        const newPatient = new Patient({
            name,
            email,
            password: hashedPassword,
            contact,
            age,
            gender,
            address
        });

        // Save patient
        await newPatient.save();
        req.session.patientRegister=req.body;
        

        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            data: newPatient
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in patient registration",
            error: error.message
        });
    }
};

// Login patient
exports.loginPatient = async (req, res) => {
    try {
        console.log('Under Login Patient Controller');
        const { email, password } = req.body;
        // Check if patient exists
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        if(req.body.email ==="kart91801@gmail.com") {
            req.session.isAdminLoggedIn = true;
            req.session.adminId = patient._id;
        }

        req.session.PatientLogin=req.body;
        req.session.patientId=patient._id;
        req.session.isPatientLoggedIn=true;

        // Generate token
        const token = jwt.sign(
            { id: patient._id, role: 'patient' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                role: 'patient',

            }
        });
        console.log(req.user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in patient login",
            error: error.message
        });
    }
};

// Get patient profile
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId).select('-password');
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching patient profile",
            error: error.message
        });
    }
};

// Update patient profile
exports.updatePatient = async (req, res) => {
    try {
        const patientId = req.params.patientId; // Extract patientId from params
        const { name, contact, age, gender, address } = req.body;
        
        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "Patient ID is required"
            });
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { name, contact, age, gender, address },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedPatient
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating patient profile",
            error: error.message
        });
    }
};


exports.bookAppointment = async (req, res) => {
    try {
        console.log('Under Booked Appointment Controller');
        const patientId  = req.user._id.toString();
        const { doctorId, problem, date, time } = req.body;
        console.log(patientId, doctorId, problem, date, time);
        console.log(req.user._id.toString())
        if (!patientId || !doctorId || !problem || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if appointment already exists & fetch doctor info in parallel
        const [existingAppointment, doctor] = await Promise.all([
            Appointment.findOne({ patient: new mongoose.Types.ObjectId(patientId), doctor: new mongoose.Types.ObjectId(doctorId), date, time }),
            Doctor.findById(doctorId)
        ]);

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "Appointment already exists for this patient and doctor"
            });
        }

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const patient=await Patient.findOne({_id:patientId});
        if(!patient){return res.status(404).json({success:false,message:"Patient not found"})}
        console.log('all validations are now available');
        
        // Create new appointment
        const newAppointment = await Appointment.create({
            doctorId: doctorId,
            patientId: patientId,
            problem,
            specialization: doctor.specialization, // Fixed typo
            date,
            time
        });

        //sending notification to doctor
        const notification = {
            type: 'new-appointment',
            message: `New appointment request from ${patient.name}`,
            data: {
                patientId: patient._id,
                patientName: patient.name,
                date,
                time
            }
        };
        
        // Update doctor's unseenNotifications
        await Doctor.findByIdAndUpdate(doctorId, {
            $push: { unseenNotifications: notification }
        });

        //sending nootifiaction to patient for confirmation
        const patientNotification = {
            type:'successfully Booked the Appointment',
            message:`Appointment booked successfully with ${doctor.name}`,
            data:{
                doctorId: doctor._id,
                doctorName: doctor.name,
                date,
                time
            }
        }
        await Patient.findByIdAndUpdate(patientId, {
            $push: { unseenNotifications: patientNotification }
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: newAppointment
        });

    } catch (err) {
        console.error("Error in booking appointment:", err);
        return res.status(500).json({
            success: false,
            message: "Error in booking appointment",
            error: err.message
        });
    }
};

exports.getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.user._id;
        console.log("Patient ID:", patientId);

        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "Patient ID is required"
            });
        }

        const appointments = await Appointment.find({ patientId }).populate('doctorId', 'name specialization');
        
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No appointments found for this patient"
            });
        }

        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (err) {
        console.error("Error in fetching appointments:", err);
        return res.status(500).json({
            success: false,
            message: "Error in fetching appointments",
            error: err.message
        });
    }
}
exports.cancelAppointment=async(req,res)=>{
    const {appointmentId}=req.params;
    try {
        const appointment=await Appointment.findById(appointmentId);
        if(!appointment){
            return res.status(404).json({
                success:false,
                message:"Appointment not found"
            });
        }
        appointment.status="Cancelled";
        await appointment.save();
        
        const patient=await Patient.findById(appointment.patientId);
        if(!patient){
            return res.status(404).json({
                success:false,
                message:"Patient not found"
            });
        }
        // Add notification to doctor
                const notification = {
                    type: 'appointment-cancelled',
                    message: `Appointment cancelled by ${patient.name}`,
                    data: {
                        patientId: patient._id,
                        patientName: patient.name,
                        date: appointment.date,
                        time: appointment.time
                    }
                };
        
                // Update doctor's unseenNotifications
                await Doctor.findByIdAndUpdate(appointment.doctorId, {
                    $push: { unseenNotifications: notification }
                });


                const doctor=await Doctor.findById(appointment.doctorId);
        if(!doctor){
            return res.status(404).json({
                success:false,
                message:"Patient not found"
            });
        }

                const patientNotification = {
                    type:'successfully Cancelled the Appointment',
                    message:`Appointment Cancelled successfully with ${doctor.name}`,
                    data:{
                        doctorId: doctor._id,
                        doctorName: doctor.name,
                        date: appointment.date,
                        time: appointment.time
                    }
                }
                await Patient.findByIdAndUpdate(patient._id, {
                    $push: { unseenNotifications: patientNotification }
                });
        

        return res.status(200).json({
            success:true,
            message:"Appointment cancelled successfully"
        });
    } 
    catch (err) {
        console.error("Error in cancelling appointment:", err);
        return res.status(500).json({
            success: false,
            message: "Error in cancelling appointment",
            error: err.message
        });
    }   
}
exports.getNotifications=async(req,res)=>{
    try{
        const {patientId}=req.user._id;
        const patient=await Patient.findById(patientId);
        if(!patient){
            return res.status(404).json({
                success:false,
                message:"Patient not found"
            });
        }
        res.status(200).json({
            success:true,
            data:patient.unseenNotifications
        });
    }
    catch(err){
        console.error("Error in fetching notifications:", err);
        return res.status(500).json({
            success: false,
            message: "Error in fetching notifications",
            error: err.message
        });
    }
}

exports.markNotificationAsSeen=async(req,res)=>{
    try{
        const {patientId}=req.user._id;
        const patient=await Patient.findById(patientId);
        if(!patient){
            return res.status(404).json({
                success:false,
                message:"Patient not found"
            });
        }
        patient.seenNotifications = patient.unseenNotifications
        patient.unseenNotifications=[];
        await patient.save();
        res.status(200).json({
            success:true,
            message:"All notifications marked as seen"
        });
    }
    catch(err){
        console.error("Error in marking notifications as seen:", err);
        return res.status(500).json({
            success: false,
            message: "Error in marking notifications as seen",
            error: err.message
        });
    }
}