const Doctor = require('../models/doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all doctors
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({}, '-password');
    res.status(200).json({
      success: true,
      count: doctors.length,
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

// Get doctor by ID
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id, '-password');
     
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
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Register new doctor
exports.registerDoctor = async (req, res, next) => {
  const {
    name,
    contact,
    email, 
    password,
    specialization,
    experience,
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

// Update doctor availability
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
