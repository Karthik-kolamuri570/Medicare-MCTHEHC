const Donate=require("./../models/Donate");
const BloodBank=require("./../models/BloodBank");
const Request=require("./../models/Request");
exports.requestDonation = async (req, res) => {
  try {
    const { bankId, units, blood_group, requestedDate } = req.body;

    // Validate input
    if (!bankId || !blood_group || !requestedDate) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!units || units <= 0) {
      return res.status(400).json({ message: "Units must be a positive number" });
    }

    // Find bank
    const bank = await BloodBank.findById(bankId);
    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    // Get user from session
    const userId = req.session?.patientId;
    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // Create new request
    const newRequest = new Request({
      user_id: userId,
      bank_id: bankId,
      blood_group,
      units_requested: units,
      requested_date: requestedDate,
      status: "pending"
    });

    await newRequest.save();
    console.log("New request saved:", newRequest);

    res.json({ message: "Request submitted successfully", request: newRequest });
  } catch (err) {
    console.error("Error requesting donation:", err);
    res.status(500).json({ message: `Server error - ${err}` });
  }
};

exports.donateBlood= async (req, res) =>{
  try {
    const { bankId, units, blood_group, requestedDate } = req.body;
    // Validate input
    if (!bankId || !blood_group || !requestedDate) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!units || units <= 0) {
      return res.status(400).json({ message: "Units must be a positive number" });
    }
    const bank = await BloodBank.findById(bankId);
    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }
    const userId = req.session?.patientId;
    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }
    //check if the user has already donated blood within 3 months then it will be rejected...
    const userRequests = await Request.find({ user_id: userId, status: "accepted" });
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth()- 3);
    const recentDonation = await Donate.findOne({
      user_id: userId,
      status: "completed",
      donation_date: { $gte: threeMonthsAgo }
    });

if (recentDonation) {
  return res.status(400).json({ message: "You have already donated blood within the last 3 months" });
}
    const newDonation = new Donate({
      user_id: userId,
      bank_id: bankId,
      blood_group,
      units_donated: units,
      requested_date: requestedDate,
      status: "pending"
    });
    await newDonation.save();
    console.log("New donation saved:", newDonation);
    res.json({ message: "Donation submitted successfully", donation: newDonation });
  } catch (err) {
    console.error("Error donating blood:", err);
    res.status(500).json({ message: `Server error - ${err}` });
  }
}

exports.acceptBloodRequest=async(req,res)=>{
  try{
    const {requestId} = req.params;
    const request = await Request.findById(requestId);
    if(!request){
      return res.status(404).json({message:"Request not found"});
    }
    const bank = await BloodBank.findById(req.session.bankLogin.bankId);
    if(!bank){
      return res.status(404).json({message:"Bank not found"});
    }
    if(request.status !== "pending"){
      return res.status(400).json({message:"Request already processed"});
    }
    // Checking if enough stock is available to accept the request...
    const bloodGroupKey = request.blood_group.replace("+", "_pos").replace("-", "_neg");
    if(bank.blood_groups[bloodGroupKey] <= request.units_requested){
      return res.status(400).json({message:"Not enough stock available"});
    }
    // Deduct stockk
    bank.blood_groups[bloodGroupKey] -= request.units_requested;
    console.log(`Deducted ${request.units_requested} units of ${request.blood_group} from bank ${bank.name}`);
    request.status = "accepted";
    await bank.save();
    await request.save();
    res.json({message:"Request accepted"});
  }catch(err){
    console.error("Error accepting request:",err);
    res.status(500).json({message:`Server error ${err}`});
  }
}

exports.acceptDonation=async(req,res)=>{
  try{
    const {donationId}=req.params;
    const donation=await Donate.findById(donationId);
    if(!donation){
      return res.status(404).json({message:"Donation not found"});
    } 
    const bank=await BloodBank.findById(req.session.bankLogin.bankId);
    if(!bank){
      return res.status(404).json({message:"Bank not found"});
    }
    if(donation.status !== "pending"){
      return res.status(400).json({message:"Donation already processed"});
    }
    const bloodGroupKey = donation.blood_group.replace("+", "_pos").replace("-", "_neg");
    if(donation.units_donated  >= bank.capacity/6){ //bank.blood_groups[bloodGroupKey]  
      return res.status(400).json({message:"Stock is  full of Capicity"});
    }
    bank.blood_groups[bloodGroupKey] += donation.units_donated;
    console.log(`Added ${donation.units_donated} units of ${donation.blood_group} to bank ${bank.name}`);
    donation.status = "accepted";
    await bank.save();
    await donation.save();
    res.json({message:"Donation accepted"});
  }
  catch(err){
    console.error("Error accepting donation:",err);
    res.status(500).json({message:`Server error ${err}`});
  }
}

exports.rejectBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // ✅ extract actual id
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected" });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ message: `Server error ${err}` });
  }
};

exports.rejectDonation = async (req, res) => {
  try {
    const { donationId } = req.params; // ✅ extract actual id
    const donation = await Donate.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== "pending") {
      return res.status(400).json({ message: "Donation already processed" });
    }

    donation.status = "rejected";
    await donation.save();

    res.json({ message: "Donation rejected" });
  } catch (err) {
    console.error("Error rejecting donation:", err);
    res.status(500).json({ message: `Server error ${err}` });
  }
};

exports.getAllBloodRequests=async(req,res)=>{
  try{
    const userId=req.session?.patientId;
    console.log("Fetching requests for userId:", userId);
    if(!userId){
      
      return res.status(401).json({message:"User not logged in"});
    }
    const requests=await Request.find({user_id:userId}).populate('bank_id','name location contact');
    if(!requests){
      return res.status(404).json({message:"No requests found"});
    }
    res.json({requests});
  }catch(err){
    console.error("Error getting requests:",err);
    res.status(500).json({message:`Server error ${err}`});
  }
}

exports.getAllDonationRequests=async(req,res)=>{
  try{
    const userId=req.session?.patientId;
    if(!userId){
      return res.status(401).json({message:"User not logged in"});
    }
    const donations=await Donate.find({user_id:userId}).populate('bank_id','name location contact');
    if(!donations){
      return res.status(404).json({message:"No donations found"});
    }
    res.json({donations});
  }catch(err){
    console.error("Error getting donations:",err);
    res.status(500).json({message:`Server error ${err}`});
  }
}   