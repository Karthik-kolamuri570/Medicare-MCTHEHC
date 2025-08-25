const Doctor = require('../models/doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Appointment = require('./../models/appointments');
const GetSecondOpinion = require('../models/GetSecondOpinion'); // Ensure this is imported
// const patient = require('../models/patient');

exports.registerDoctor = async (req, res, next) => {
  const {
    name,
    contact,
    email, 
    password,
    specialization,
    experience,
    location,
    hospital,
    feePerConsultation,
    fromTime,
    toTime
  } = req.body;

  try {
    // Check if doctor already exists
    let doctor = await Doctor.findOne({ email });
    
    if (doctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already exists'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new doctor
    doctor = new Doctor({
        name,
        contact,
        email,
        password:hashedPassword,
        specialization,
        experience,
        location,
        hospital,
        feePerConsultation,
        fromTime,
        toTime
    });
    req.session.DoctorRegister=req.body;
    await doctor.save();
    req.session.save();
    
    // Create token
    const token = jwt.sign(
      { id: doctor._id, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        location: doctor.location,
        hospital: doctor.hospital,
        feePerConsultation: doctor.feePerConsultation,
        fromTime: doctor.fromTime,
        toTime: doctor.toTime
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Login doctor
exports.loginDoctor = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    console.log("Doctor login attempt with email:", email);
    
    // Check if doctor exists
    const doctor = await Doctor.findOne({ email });
    
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, doctor.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create token
    const token = jwt.sign(
      { id: doctor._id, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    req.session.doctorLogin=req.body;
    req.session.isDoctorLoggedIn=true;
    req.session.doctorId=doctor._id;
    req.session.save();
    res.status(200).json({
      success: true,
      token,
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        location: doctor.location,
        hospital: doctor.hospital,
        feePerConsultation: doctor.feePerConsultation,
        fromTime: doctor.fromTime,
        toTime: doctor.toTime
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};


// Update doctor profile
exports.updateDoctor = async (req, res, next) => {
  try {
    // Don't allow password updates through this route
    if (req.body.password) {
      delete req.body.password;
    }
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, select: '-password' }
    );
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};


// Get all doctors
exports.getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find();
        
        res.status(200).json({
          success: true,
          data: doctors
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: 'Server Error'
        });
      }
}

//get doctor by id
exports.getDoctorById = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};


// Delete doctor
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.updateAvailability = async (req, res, next) => {
    try {
        const { fromTime, toTime } = req.body;
        const doctorId = req.user._id;

        if (!fromTime || !toTime) {
            return res.status(400).json({
                success: false,
                message: 'Please provide fromTime and toTime'
            });
        }

        const doctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { fromTime, toTime },
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
// Get all appointments for a doctor
exports.getDoctorAppointments = async (req, res, next) => {
    try {
      console.log(req.user._id.toString());
        const appointments = await Appointment.find({ doctorId: req.user._id }).populate('patientId');
        if(!appointments){
            res.status(500).json({
                success: false,
                message: 'No appointments found'
            });
        }
        res.status(200).json({
        success: true,
        data: appointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: 'Server Error'
        });
    }
}

exports.getDoctorPatients = async (req, res, next) => {
    try {
        const patients = await Appointment.find({ doctorId: req.user._id }).select('patientId')
        if(!patients){
            res.status(500).json({
                success: false,
                message: 'No patients found'
            });
        }
        console.log(patients);
        
        res.status(200).json({
        success: true,
        data: patients
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: 'Server Error'
        });
    }
}

exports.getDoctorBySpecialization = async (req, res, next) => {
    try {
        const specialization = req.params.specialization;
        const doctors = await Doctor.find({ specialization });
        if (!doctors || doctors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No doctors found with this specialization'
            });
        }
        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getDoctorByLocation = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({ location: req.params.location });
        if (!doctors) {
          res.status(500).json({
            success: false,
            message: 'No doctors found in this location'
          })
          
        }
        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.logoutDoctor = async (req, res, next) => {
  req.session.destroy((err)=>{
    if (err){
      console.log("Error in destroying session:", err);
      return res.json({
        success: false,
        message : 'Error in logging out'  
      })
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    console.log("Doctor logged out successfully");
    res.status(200).json({
      success: true,
      message: 'Doctor logged out successfully'
    });

  })
}

//Accepted Appointments for the Doctor... Storing in the Doctor's Collection as appointments
exports.acceptAppointment=async(req,res)=>{
  const appointmentId=req.params.id;
  const doctorId=req.session.doctorId;
  try{
    console.log("Accepting appointment with ID:", appointmentId);

    // Check if appointment exists in  the Appointment  Collection...
    const appointment=await Appointment.findById(appointmentId);
    if(!appointment){
      return res.json({
        success:false,
        message:'Appointment not found...'
      })
    }
    console.log(`Doctor Id : ${doctorId.toString()}`);

    //After checking the appointment, we need to check if the appointment belongs to the doctor or not ,if it belongs to doctor then we will give access to Accepting the Appointment...
    if(appointment.doctorId.toString() !== doctorId.toString()){
      return res.json({
        success: false,
        message: 'You are not authorized to accept this appointment'
      });
    }
    //Updating the status of the appointment to 'Accepted'...
    appointment.status = 'Accepted';
    await appointment.save();
    //here we can also delete the appointment from the Appointment Collection if we want to but what i have to is i want to  show both pending and accepted appointments in the doctor profile so i will not delete it from the Appointment Collection...
    // const delApp=await Appointment.findByIdAndDelete(appointmentId)
    // await delApp.save();
    console.log("Appointment accepted successfully:", appointment);
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.json({
        success: false,
        message: 'Doctor not found'
      });
    }
    // Check if the appointment already exists in the doctor's appointments array
    const existingAppointment = doctor.appointments.find(app => app._id.toString() === appointmentId);
    if (existingAppointment) {
      return res.json({
        success: false,
        message: 'Appointment already exists in doctor\'s appointments'
      });
    }
    //sending the appointment which is accepted in the frontend to Doctor appointments array in Doctor's Collection... 
    doctor.appointments.push(appointment);
    await doctor.save();
    res.status(200).json({
      success: true,
      message: 'Appointment accepted successfully',
      data: appointment
    });
  }
  catch(error){
    console.error("Error accepting appointment:", error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}


// exports.getAcceptedAppointments = async (req, res) => {
//   try {
//     console.log("Fetching accepted appointments for doctor:", req.user._id);
//     const doctorId = req.user._id;

//     const doctor = await Doctor.findById(doctorId).populate('appointments');
//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: 'Doctor not found',
//       });
//     }

//     // Map over appointments, get patient info
//     const patientAppointments = doctor.appointments.map(async (appointment) => {
//       const patient = await Patient.findById(appointment.patientId);
//       return {
//         appointmentId: appointment._id,
//         patientName: patient ? patient.name : 'Unknown',
//         appointmentDate: appointment.date,
//         appointmentTime: appointment.time,
//         problem: appointment.problem,
//       };
//     });

//     // Wait for all promises to resolve
//     const acceptedAppointments = await Promise.all(patientAppointments);

//     res.status(200).json({
//       success: true,
//       data: acceptedAppointments,
//     });

//   } catch (error) {
//     console.error("Error fetching accepted appointments:", error);
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//     });
//   }
// };






exports.getAcceptedAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    console.log("Fetching appointments for doctor:", doctorId);

    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'Doctor ID is required' });
    }

    // Step 1: Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Step 2: Get all appointment IDs from doctor
    const appointmentIds = doctor.appointments;

    if (!appointmentIds || appointmentIds.length === 0) {
      return res.status(404).json({ success: false, message: 'No appointments linked to this doctor' });
    }

    // Step 3: Find appointments by those IDs
    const appointmentDetails = await Appointment.find({
      _id: { $in: appointmentIds }
    })
      .select('doctorId problem date time  patientId')
      .populate({
        path: 'patientId',
        select: 'name contact'
      })
      .sort({ date: 1, time: 1 }); // optional sorting by upcoming

    if (!appointmentDetails || appointmentDetails.length === 0) {
      return res.status(404).json({ success: false, message: 'No appointment details found' });
    }

    // Step 4: give thee reponse to the frontend
    res.status(200).json({
      success: true,
      data: appointmentDetails
    });

  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};




exports.getSecondOpinion = async (req, res) => {
  try {
    const doctorId = req.user._id;
    console.log("Fetching appointments for doctor:", doctorId);
    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'Doctor ID is required' });
    }
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const secondOpinionRequests = await GetSecondOpinion.find({ doctorId: doctorId })
      .populate('patientId', 'name contact')
      .sort({ createdAt: -1 }); // Sort by most recent first  
    if (!secondOpinionRequests || secondOpinionRequests.length === 0) {
      return res.status(404).json({ success: false, message: 'No second opinion requests found' });
    }
    
    res.status(200).json({
      success: true,
      data: secondOpinionRequests
    });
  }
  catch (error) {
    console.error("Error fetching second opinion requests:", error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// In your backend controller file

exports.acceptGetSecondOpinion = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const requestId = req.params.id;
    const { status } = req.body;

    // --- Validation: Ensure status is valid ---
    if (!status || !['accepted', 'rejected'].includes(status.toLowerCase())) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid status provided. Must be "accepted" or "rejected".' 
        });
    }

    const secondOpinionRequest = await GetSecondOpinion.findById(requestId);
    if (!secondOpinionRequest) {
      return res.status(404).json({ success: false, message: 'Second opinion request not found' });
    }

    // This prevents the server from crashing if doctorId is missing.
    if (!secondOpinionRequest.doctorId) {
        console.error(`Request ${requestId} has no doctorId assigned.`);
        return res.status(403).json({ success: false, message: 'This request is not assigned to any doctor.' });
    }
    
    // Now we can safely check for authorization
    if (secondOpinionRequest.doctorId.toString() !== doctorId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this request.' });
    }

    // Update and save the document
    secondOpinionRequest.status = status.toLowerCase();
    await secondOpinionRequest.save();

    return res.json({
      success: true,
      message: `Second opinion request ${status} successfully`,
      data: secondOpinionRequest
    });

  } catch (error) {
    console.error("Error updating second opinion request:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};