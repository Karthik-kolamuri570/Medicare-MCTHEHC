const Doctor = require('../models/doctor');
const bcrypt = require('bcryptjs');
const Patient = require('../models/patient');
const Admin = require('../models/admin');
const Appointment = require('./../models/appointments');
const GetSecondOpinion = require('./../models/GetSecondOpinion');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { createNotification } = require('../utils/notification');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

const multer = require("multer");
const path = require("path");
const { s3Client: s3, generatePresignedUrl } = require('../utils/s3Config');
const multerS3 = require('multer-s3');

// Multer-S3 config for profile images
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const folder = "profiles/";
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, folder + file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
  })
});

exports.uploadProfile = upload.single("profileImage");

// Controller for updating profile image
exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const profileImageUrl = req.file.location;
    const doctor = await Doctor.findByIdAndUpdate(userId, { profileImage: profileImageUrl }, { new: true });

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Generate signed URL for the response
    const signedUrl = await generatePresignedUrl(profileImageUrl);

    res.status(200).json({ success: true, message: "Profile image updated", data: { ...doctor.toObject(), profileImage: signedUrl } });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

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
      password: hashedPassword,
      specialization,
      experience,
      location,
      hospital,
      feePerConsultation,
      fromTime,
      toTime
    });
    await doctor.save();

    // Notify Admins about new doctor registration
    const adminNotify = createNotification('verification', `New doctor registration: Dr. ${name}. Approval required.`, {
      doctorId: doctor._id,
      doctorName: name,
      email: email
    });
    // Push to all active admins
    await Admin.updateMany({ status: 'active' }, { $push: { unseenNotifications: adminNotify } }).catch(e => console.error("Admin notification failed:", e));

    // Create tokens
    const tokenPayload = { id: doctor._id, role: 'doctor' };
    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(201).json({
      success: true,
      token,
      refreshToken,
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

    // Create tokens
    const tokenPayload = { id: doctor._id, role: 'doctor' };
    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(200).json({
      success: true,
      token,
      refreshToken,
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
    const filter = {};
    if (req.query.verified === 'approved') filter.verifiedByAdmin = 'approved';
    const doctors = await Doctor.find(filter);

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

    // Generate signed URL for profile image
    const doctorObj = doctor.toObject();
    if (doctorObj.profileImage) {
      doctorObj.profileImage = await generatePresignedUrl(doctorObj.profileImage);
    }

    res.status(200).json({
      success: true,
      data: doctorObj
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
    const appointments = await Appointment.find({ doctorId: req.user._id }).populate('patientId');
    if (!appointments) {
      res.status(500).json({
        success: false,
        message: 'No appointments found'
      });
    }
    //add the doctor name to the appointments
    appointments.forEach(appointment => {
      appointment.doctorName = req.user.name; // Assuming req.user contains the doctor's info
    });
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
    if (!patients) {
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
  // JWT is stateless — client clears the token
  res.status(200).json({
    success: true,
    message: 'Doctor logged out successfully'
  });
}

//Accepted Appointments for the Doctor... Storing in the Doctor's Collection as appointments
exports.acceptAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const doctorId = req.user._id;
  try {
    console.log("Accepting appointment with ID:", appointmentId);

    // Check if appointment exists in  the Appointment  Collection...
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.json({
        success: false,
        message: 'Appointment not found...'
      })
    }
    console.log(`Doctor Id : ${doctorId.toString()}`);

    //After checking the appointment, we need to check if the appointment belongs to the doctor or not ,if it belongs to doctor then we will give access to Accepting the Appointment...
    if (appointment.doctorId.toString() !== doctorId.toString()) {
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
    const existingIndex = doctor.appointments.findIndex(app => app._id.toString() === appointmentId);
    if (existingIndex !== -1) {
      // Update existing entry (e.g. after reschedule, date/time may have changed)
      doctor.appointments[existingIndex] = appointment;
    } else {
      //sending the appointment which is accepted in the frontend to Doctor appointments array in Doctor's Collection... 
      doctor.appointments.push(appointment);
    }
    await doctor.save();

    // Notify patient that appointment was accepted
    const patientNotify = createNotification('appointment-accepted', `Your appointment with Dr. ${doctor.name} has been accepted.`, {
      appointmentId: appointment._id,
      doctorId: doctor._id,
      doctorName: doctor.name,
      date: appointment.date,
      time: appointment.time
    });
    await Patient.findByIdAndUpdate(appointment.patientId, { $push: { unseenNotifications: patientNotify } });

    res.status(200).json({
      success: true,
      message: 'Appointment accepted successfully',
      data: appointment
    });
  }
  catch (error) {
    console.error("Error accepting appointment:", error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}

//Reject Appointment by the Doctor...
exports.rejectAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const doctorId = req.user._id;
  try {
    console.log("Rejecting appointment with ID:", appointmentId);
    // Check if appointment exists in  the Appointment  Collection...
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.json({
        success: false,
        message: 'Appointment not found...'
      })
    }
    console.log(`Doctor Id : ${doctorId.toString()}`);
    //After checking the appointment, we need to check if the appointment belongs to the doctor or not ,if it belongs to doctor then we will give access to Rejecting the Appointment...
    if (appointment.doctorId.toString() !== doctorId.toString()) {
      return res.json({
        success: false,
        message: 'You are not authorized to reject this appointment'
      });
    }
    //Updating the status of the appointment to 'Rejected'...
    appointment.status = 'Rejected';
    await appointment.save();

    // Notify patient that appointment was rejected
    const doctor = await Doctor.findById(doctorId);
    const patientNotify = createNotification('appointment-rejected', `Your appointment with Dr. ${doctor?.name || 'Doctor'} has been rejected.`, {
      appointmentId: appointment._id,
      doctorId: doctor?._id,
      doctorName: doctor?.name,
      date: appointment.date,
      time: appointment.time
    });
    await Patient.findByIdAndUpdate(appointment.patientId, { $push: { unseenNotifications: patientNotify } });

    console.log("Appointment rejected successfully:", appointment);
    res.status(200).json({
      success: true,
      message: 'Appointment rejected successfully',
      data: appointment
    });

  }
  catch (error) {
    console.error("Error rejecting appointment:", error);
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

    // Map and sign URLs for each request
    const enrichedRequests = await Promise.all(secondOpinionRequests.map(async (request) => {
      const requestObj = request.toObject();
      if (requestObj.files && requestObj.files.length > 0) {
        requestObj.files = await Promise.all(requestObj.files.map(file => generatePresignedUrl(file)));
      }
      return requestObj;
    }));

    res.status(200).json({
      success: true,
      data: enrichedRequests
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


//In this Route i actually updating the status of the second opinion request at a time ....
// exports.acceptGetSecondOpinion = async (req, res) => {
//   try {
//     const doctorId = req.user._id;
//     const requestId = req.params.id;
//     const { status } = req.body;

//     // --- Validation: Ensure status is valid ---
//     if (!status || !['accepted', 'rejected'].includes(status.toLowerCase())) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Invalid status provided. Must be "accepted" or "rejected".' 
//         });
//     }

//     const secondOpinionRequest = await GetSecondOpinion.findById(requestId);
//     if (!secondOpinionRequest) {
//       return res.status(404).json({ success: false, message: 'Second opinion request not found' });
//     }
//     // This prevents the server from crashing if doctorId is missing.
//     if (!secondOpinionRequest.doctorId) {
//         console.error(`Request ${requestId} has no doctorId assigned.`);
//         return res.status(403).json({ success: false, message: 'This request is not assigned to any doctor.' });
//     }
//     // Now we can safely check for authorization
//     if (secondOpinionRequest.doctorId.toString() !== doctorId.toString()) {
//       return res.status(403).json({ success: false, message: 'You are not authorized to update this request.' });
//     }
//     // Update and save the document
//     secondOpinionRequest.status = status.toLowerCase();
//     await secondOpinionRequest.save();
//     return res.json({
//       success: true,
//       message: `Second opinion request ${status} successfully`,
//       data: secondOpinionRequest
//     });

//   } catch (error) {
//     console.error("Error updating second opinion request:", error);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };


// doctorController.js
exports.acceptGetSecondOpinion = async (req, res) => {
  console.log("🔥 CONTROLLER CALLED - acceptGetSecondOpinion");
  console.log("Request params:", req.params);
  console.log("Request body:", req.body);
  console.log("Request user:", req.user);

  try {
    // Step 1: Basic validation
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      console.log("❌ Missing id or status");
      return res.status(400).json({
        success: false,
        message: "ID and status are required",
        received: { id, status }
      });
    }

    // Step 2: Import and test model
    let GetSecondOpinion;
    try {
      GetSecondOpinion = require('../models/GetSecondOpinion'); // Adjust path if needed
      console.log("✅ GetSecondOpinion model imported successfully");
    } catch (importError) {
      console.error("❌ Failed to import GetSecondOpinion model:", importError.message);
      return res.status(500).json({
        success: false,
        message: "Model import failed",
        error: importError.message
      });
    }

    // Step 3: Test database query
    console.log("🔍 Searching for record with ID:", id);
    let existingRecord;
    try {
      existingRecord = await GetSecondOpinion.findById(id);
      console.log("🔍 Record found:", !!existingRecord);
    } catch (dbError) {
      console.error("❌ Database query failed:", dbError.message);
      return res.status(500).json({
        success: false,
        message: "Database query failed",
        error: dbError.message
      });
    }

    if (!existingRecord) {
      console.log("❌ No record found with ID:", id);
      return res.status(404).json({
        success: false,
        message: "Record not found",
        id: id
      });
    }

    // Step 4: Update record
    console.log("📝 Updating record...");
    try {
      const updatedRequest = await GetSecondOpinion.findByIdAndUpdate(
        id,
        {
          status: status,
          respondedAt: new Date()
        },
        {
          new: true
        }
      );

      console.log("✅ Record updated successfully");

      // Sign URLs for the updated request before returning
      const updatedRequestObj = updatedRequest.toObject();
      if (updatedRequestObj.files && updatedRequestObj.files.length > 0) {
        updatedRequestObj.files = await Promise.all(updatedRequestObj.files.map(file => generatePresignedUrl(file)));
      }

      // Notify patient about second opinion status change
      const doctor = await Doctor.findById(updatedRequest.doctorId);
      const patientNotify = createNotification(`second-opinion-${status.toLowerCase()}`, `Your second opinion request with Dr. ${doctor?.name || 'Doctor'} has been ${status}.`, {
        requestId: updatedRequest._id,
        doctorId: doctor?._id,
        doctorName: doctor?.name,
        status: status
      });
      await Patient.findByIdAndUpdate(updatedRequest.patientId, { $push: { unseenNotifications: patientNotify } });

      res.status(200).json({
        success: true,
        message: `Request ${status} successfully`,
        data: updatedRequestObj
      });

    } catch (updateError) {
      console.error("❌ Update failed:", updateError.message);
      return res.status(500).json({
        success: false,
        message: "Update failed",
        error: updateError.message
      });
    }


  } catch (error) {
    console.error("❌ CONTROLLER ERROR:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Controller error",
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};

exports.getAllSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct('specialization');
    res.status(200).json({
      success: true,
      data: specializations.filter(s => s) // Filter out null/empty strings
    });
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.getAcceptedSecondOpinion = async (req, res) => {
  try {
    //Here I Fetching all the second opinion requests which are accepted by the doctor...
    const doctorId = req.user._id;
    console.log(`Fetching all the accepted Appointments of Get Second Opinion by the Doctor ${doctorId}`);
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(403).json({ success: false, message: 'Doctor Not Found...' });
    }
    const appointments = await GetSecondOpinion.find({ doctorId: doctorId, status: "accepted" }).populate('patientId', 'name contact');
    console.log("Fetching  the Appointments....")

    // Generate signed URLs for all files
    const enrichedAppointments = await Promise.all(appointments.map(async (appointment) => {
      const apptObj = appointment.toObject();
      if (apptObj.files && apptObj.files.length > 0) {
        apptObj.files = await Promise.all(apptObj.files.map(file => generatePresignedUrl(file)));
      }
      return apptObj;
    }));

    return res.json({
      success: true,
      data: enrichedAppointments
    })
  }
  catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Server Error..."
    })
  }
}

// ============ FORGOT PASSWORD ============
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (!doctor) {
      // Don't reveal whether email exists
      return res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save to DB with 1-hour expiry
    doctor.resetPasswordToken = hashedToken;
    doctor.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await doctor.save({ validateBeforeSave: false });

    // Build reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/doctor?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email via SMTP
    await sendPasswordResetEmail(email, resetUrl, doctor.name || 'Doctor');

    return res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process request. Please try again.' });
  }
};

// ============ RESET PASSWORD ============
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword, confirmPassword } = req.body;

    if (!token || !email || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Hash the token to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const doctor = await Doctor.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!doctor) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(newPassword, salt);
    doctor.resetPasswordToken = null;
    doctor.resetPasswordExpires = null;
    await doctor.save({ validateBeforeSave: false });

    return res.json({ success: true, message: 'Password has been reset successfully. You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset password. Please try again.' });
  }
};

// ============ DOCTOR NOTIFICATIONS ============
exports.getNotifications = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    res.json({
      success: true,
      data: {
        unseenNotifications: doctor.unseenNotifications || [],
        seenNotifications: doctor.seenNotifications || []
      }
    });
  } catch (err) {
    console.error('Get doctor notifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

exports.getNotificationCount = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id).select('unseenNotifications');
    if (!doctor) return res.status(404).json({ success: false, count: 0 });
    res.json({ success: true, count: (doctor.unseenNotifications || []).length });
  } catch (err) {
    res.status(500).json({ success: false, count: 0 });
  }
};

exports.markNotificationsAsSeen = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Move unseen to seen
    doctor.seenNotifications = [
      ...(doctor.seenNotifications || []),
      ...(doctor.unseenNotifications || [])
    ];
    doctor.unseenNotifications = [];
    await doctor.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'All notifications marked as seen' });
  } catch (err) {
    console.error('Mark doctor notifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to mark notifications' });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    doctor.unseenNotifications = [];
    doctor.seenNotifications = [];
    await doctor.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'All notifications cleared' });
  } catch (err) {
    console.error('Clear doctor notifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to clear notifications' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { index, type } = req.body; // type: 'unseen' or 'seen'
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    if (type === 'unseen') {
      doctor.unseenNotifications.splice(index, 1);
    } else {
      doctor.seenNotifications.splice(index, 1);
    }
    await doctor.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete doctor notification error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};