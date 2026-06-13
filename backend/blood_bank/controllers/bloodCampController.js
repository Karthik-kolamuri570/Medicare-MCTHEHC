const BloodCamp = require("../models/BloodCamp");
const Doctor = require("../../models/doctor");
const Donate = require("../models/Donate");

// CREATE a new blood camp with validations assumed done by Mongoose
exports.createBloodCamp = async (req, res) => {
  try {
    // Auth is handled by middleware
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor account not found" });
    }
    if (doctor.verifiedByAdmin !== 'approved') {
      return res.status(403).json({ message: "Only approved doctors can create blood camps" });
    }
    const campp = req.body;
    if (new Date(campp.end_date) < new Date(campp.start_date)) {
      return res.status(400).json({ message: "End date must be after start date" });
    }
    //check the camp is  registered once or not by using the same name and start location...
    const existingCamp = await BloodCamp.findOne({
      name: campp.name,
      "location.address": campp.location?.address
    });
    if (existingCamp) {
      return res.status(400).json({ message: "Camp with same name and location already exists" });
    }
    const campData = {
      ...campp,
      organizer: req.user._id, // The authenticated doctor creating the camp
    };

    const camp = new BloodCamp(campData);
    await camp.save();
    res.status(201).json(camp);
  } catch (error) {
    console.error("Failed to create blood camp:", error);
    // Distinguish validation errors from server errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create blood camp" });
  }
};

// GET all blood camps (public or authenticated)
exports.getBloodCamps = async (req, res) => {
  try {
    const camps = await BloodCamp.find()
      .populate("organizer", "name email")
      .populate("blood_bank", "name location");
    res.json(camps);
  } catch (error) {
    console.error("Failed to fetch blood camps:", error);
    res.status(500).json({ message: "Failed to fetch blood camps" });
  }
};

// GET a single camp by ID
exports.getBloodCampById = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("blood_bank", "name location");
    if (!camp) return res.status(404).json({ message: "Camp not found" });
    res.json(camp);
  } catch (error) {
    console.error("Failed to fetch camp:", error);
    res.status(500).json({ message: "Failed to fetch camp" });
  }
};

// UPDATE existing camp (only by the organizing doctor)
exports.updateBloodCamp = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    if (camp.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the organizing doctor can update this camp." });
    }

    Object.assign(camp, req.body);

    await camp.save();
    res.json(camp);
  } catch (error) {
    console.error("Failed to update camp:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Failed to update camp" });
  }
};

// DELETE a camp (only by organizer doctor)
exports.deleteBloodCamp = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    if (camp.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the organizing doctor can delete this camp." });
    }

    await camp.deleteOne();
    res.json({ message: "Camp deleted successfully" });
  } catch (error) {
    console.error("Failed to delete camp:", error);
    res.status(500).json({ message: "Failed to delete camp" });
  }
};

exports.getCampsByDoctor = async (req, res) => {
  try {
    const camps = await BloodCamp.find({ organizer: req.user._id })
      .populate("blood_bank", "name location");
    res.json(camps);
  } catch (error) {
    console.error("Failed to fetch doctor's camps:", error);
    res.status(500).json({ message: "Failed to fetch doctor's camps" });
  }
};


exports.addDonorToCamp = async (req, res) => {
  try {
    const { campId } = req.params;
    const {
      donorId,
      blood_group,   // required string
      units,         // required number
      donation_time, // optional ISO date string
      verified       // optional boolean
    } = req.body;

    // Validate required fields
    if (!donorId || !blood_group || !units) {
      return res.status(400).json({ message: 'donorId, blood_group, and units are required' });
    }

    const camp = await BloodCamp.findById(campId);
    if (!camp) {
      return res.status(404).json({ message: 'Blood camp not found' });
    }

    if (!camp.donors) camp.donors = [];
    if (!camp.donations) camp.donations = [];

    // Check if donor already added
    if (camp.donors.some(d => d.toString() === donorId)) {
      return res.status(400).json({ message: 'Donor already added to this camp' });
    }

    // Add donor id
    camp.donors.push(donorId);

    // Add donation details
    camp.donations.push({
      donor: donorId,
      blood_group,
      units,
      donation_time: donation_time ? new Date(donation_time) : new Date(),
      verified: verified === true
    });

    await camp.save();

    return res.json({ message: 'Donor added successfully', camp });
  } catch (error) {
    console.error('Error adding donor to camp:', error);
    return res.status(500).json({ message: 'Failed to add donor to camp' });
  }
};


// Get donors list (doctor/admin only)
exports.getDonorsByCamp = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.campId).populate('donations.donor', 'name email phone');
    if (!camp) return res.status(404).json({ message: 'Camp not found' });
    res.json(camp.donations || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donors' });
  }
};

// Patient registers for a blood camp
exports.registerForCamp = async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.campId);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });
    
    // Check if the user has already donated blood in any camp within the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const recentCampDonation = await BloodCamp.findOne({
      donations: {
        $elemMatch: {
          donor: req.user._id,
          status: "donated",
          donation_time: { $gte: ninetyDaysAgo }
        }
      }
    });

    if (recentCampDonation) {
      const d = recentCampDonation.donations.find(
        dn => dn.donor.toString() === req.user._id.toString() && 
              dn.status === "donated" && 
              dn.donation_time >= ninetyDaysAgo
      );
      if (d && d.donation_time) {
        const lastDonationDate = d.donation_time;
        const nextAllowedDate = new Date(lastDonationDate);
        nextAllowedDate.setDate(nextAllowedDate.getDate() + 90);
        const remainingDays = Math.ceil((nextAllowedDate - new Date()) / (1000 * 60 * 60 * 24));
        
        return res.status(400).json({
          success: false,
          message: `You cannot register for this camp yet. You last donated at a camp on ${lastDonationDate.toISOString().split('T')[0]}. You must wait 90 days between donations (${remainingDays} days remaining, allowed from ${nextAllowedDate.toISOString().split('T')[0]}).`
        });
      }
    }

    // Check if patient is already registered
    const isRegistered = camp.donations.some(d => d.donor.toString() === req.user._id.toString());
    if (isRegistered) {
      return res.status(400).json({ message: 'You are already registered for this camp' });
    }

    camp.donations.push({
      donor: req.user._id,
      blood_group: req.body.blood_group || 'Unknown',
      units: 0,
      status: 'not yet donated'
    });

    await camp.save();
    res.json({ message: 'Successfully registered for blood camp', camp });
  } catch (error) {
    console.error('Failed to register for camp:', error);
    res.status(500).json({ message: 'Failed to register for camp' });
  }
};

// Doctor updates donor status
exports.updateDonorStatus = async (req, res) => {
  try {
    const { campId, donorId } = req.params;
    const { status, units, blood_group } = req.body;

    const camp = await BloodCamp.findById(campId);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });

    // Ensure the doctor owns the camp
    if (camp.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this camp' });
    }

    const donation = camp.donations.find(d => d.donor.toString() === donorId);
    if (!donation) return res.status(404).json({ message: 'Donor not found in this camp' });

    if (status) donation.status = status;
    if (units !== undefined) donation.units = Number(units);
    if (blood_group) donation.blood_group = blood_group;

    if (status === 'donated') {
      donation.verified = true;
      if (!donation.donation_time) donation.donation_time = new Date();
    }

    await camp.save();
    res.json({ message: 'Donor updated successfully', donation });
  } catch (error) {
    console.error('Failed to update donor:', error);
    res.status(500).json({ message: 'Failed to update donor' });
  }
};
