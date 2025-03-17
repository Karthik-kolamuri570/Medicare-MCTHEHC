const Doctor = require('../models/doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Appointment = require('../models/appointments');

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
    
    await doctor.save();
    
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
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    doctor.availability = req.body.availability;
    await doctor.save();
    
    res.status(200).json({
      success: true,
      data: doctor.availability
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.getDoctorAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.doctorId });
        
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
        const patients = await Patient.find({ doctorId: req.params.doctorId });
        
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
        const doctors = await Doctor.find({ specialization: req.params.specialization });
        
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

exports.getDoctorByLocation = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({ location: req.params.location });
        
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