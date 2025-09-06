const BloodCamp = require("../models/BloodCamp");

// CREATE a new blood camp with validations assumed done by Mongoose
exports.createBloodCamp = async (req, res) => {
  try {
    if (!req.session || !req.session.doctorId) {
      console.log(`Unauthorized access attempt to create blood camp `);
      return res.status(401).json({ message: "Authentication required" });
    }
    const campp=req.body;
    if(new Date(campp.end_date)<new Date(campp.start_date)){
      return res.status(400).json({message:"End date must be after start date"});
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
      organizer: req.session.doctorId, // The authenticated doctor creating the camp
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

    if (camp.organizer.toString() !== req.session.doctorId.toString()) {
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

    if (camp.organizer.toString() !== req.session.doctorId.toString()) {
      console.log(`Unauthorized delete attempt by doctor ${req.session.doctorId} on camp ${camp.organizer}`);
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
    console.log(`Fetching camps for doctor ID: ${req.session.doctorId}`);
    const camps = await BloodCamp.find({ organizer: req.session.doctorId })
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
    const camp = await BloodCamp.findById(req.params.campId).populate('donations', 'name email phone blood_group');
    if (!camp) return res.status(404).json({ message: 'Camp not found' });
    console.log(`Fetched donors for camp ${req.params.campId}:`, camp.donations);
    res.json(camp.donations.donor || []);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donors' });
  }
};
