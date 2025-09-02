// const Donate=require("./../models/Donate");
// const BloodBank=require("./../models/BloodBank");
// const Request=require("./../models/Request");
// exports.requestDonation = async (req, res) => {
//   try {
//     const { bankId, units, blood_group, requestedDate } = req.body;

//     // Validate input
//     if (!bankId || !blood_group || !requestedDate) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (!units || units <= 0) {
//       return res.status(400).json({ message: "Units must be a positive number" });
//     }

//     // Find bank
//     const bank = await BloodBank.findById(bankId);
//     if (!bank) {
//       return res.status(404).json({ message: "Bank not found" });
//     }

//     // Get user from session
//     const userId = req.session?.patientId;
//     if (!userId) {
//       return res.status(401).json({ message: "User not logged in" });
//     }

//     // Create new request
//     const newRequest = new Request({
//       user_id: userId,
//       bank_id: bankId,
//       blood_group,
//       units_requested: units,
//       requested_date: requestedDate,
//       status: "pending"
//     });

//     await newRequest.save();
//     console.log("New request saved:", newRequest);

//     res.json({ message: "Request submitted successfully", request: newRequest });
//   } catch (err) {
//     console.error("Error requesting donation:", err);
//     res.status(500).json({ message: `Server error - ${err}` });
//   }
// };

// exports.donateBlood= async (req, res) =>{
//   try {
//     const { bankId, units, blood_group, requestedDate } = req.body;
//     // Validate input
//     if (!bankId || !blood_group || !requestedDate) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (!units || units <= 0) {
//       return res.status(400).json({ message: "Units must be a positive number" });
//     }
//     const bank = await BloodBank.findById(bankId);
//     if (!bank) {
//       return res.status(404).json({ message: "Bank not found" });
//     }
//     const userId = req.session?.patientId;
//     if (!userId) {
//       return res.status(401).json({ message: "User not logged in" });
//     }
//     //check if the user has already donated blood within 3 months then it will be rejected...
//     const userRequests = await Request.find({ user_id: userId, status: "accepted" });
//     const currentDate = new Date();
//     const threeMonthsAgo = new Date(currentDate);
//     threeMonthsAgo.setMonth(currentDate.getMonth()- 3);
//     const recentDonation = await Donate.findOne({
//       user_id: userId,
//       status: "completed",
//       donation_date: { $gte: threeMonthsAgo }
//     });

// if (recentDonation) {
//   return res.status(400).json({ message: "You have already donated blood within the last 3 months" });
// }
//     const newDonation = new Donate({
//       user_id: userId,
//       bank_id: bankId,
//       blood_group,
//       units_donated: units,
//       requested_date: requestedDate,
//       status: "pending"
//     });
//     await newDonation.save();
//     console.log("New donation saved:", newDonation);
//     res.json({ message: "Donation submitted successfully", donation: newDonation });
//   } catch (err) {
//     console.error("Error donating blood:", err);
//     res.status(500).json({ message: `Server error - ${err}` });
//   }
// }

// exports.acceptBloodRequest=async(req,res)=>{
//   try{
//     const {requestId} = req.params;
//     const request = await Request.findById(requestId);
//     if(!request){
//       return res.status(404).json({message:"Request not found"});
//     }
//     const bank = await BloodBank.findById(req.session.bankLogin.bankId);
//     if(!bank){
//       return res.status(404).json({message:"Bank not found"});
//     }
//     if(request.status !== "pending"){
//       return res.status(400).json({message:"Request already processed"});
//     }
//     // Checking if enough stock is available to accept the request...
//     const bloodGroupKey = request.blood_group.replace("+", "_pos").replace("-", "_neg");
//     if(bank.blood_groups[bloodGroupKey] <= request.units_requested){
//       return res.status(400).json({message:"Not enough stock available"});
//     }
//     // Deduct stockk
//     bank.blood_groups[bloodGroupKey] -= request.units_requested;
//     console.log(`Deducted ${request.units_requested} units of ${request.blood_group} from bank ${bank.name}`);
//     request.status = "accepted";
//     await bank.save();
//     await request.save();
//     res.json({message:"Request accepted"});
//   }catch(err){
//     console.error("Error accepting request:",err);
//     res.status(500).json({message:`Server error ${err}`});
//   }
// }

// exports.acceptDonation=async(req,res)=>{
//   try{
//     const {donationId}=req.params;
//     const donation=await Donate.findById(donationId);
//     if(!donation){
//       return res.status(404).json({message:"Donation not found"});
//     } 
//     const bank=await BloodBank.findById(req.session.bankLogin.bankId);
//     if(!bank){
//       return res.status(404).json({message:"Bank not found"});
//     }
//     if(donation.status !== "pending"){
//       return res.status(400).json({message:"Donation already processed"});
//     }
//     const bloodGroupKey = donation.blood_group.replace("+", "_pos").replace("-", "_neg");
//     if(donation.units_donated  >= bank.capacity/6){ //bank.blood_groups[bloodGroupKey]  
//       return res.status(400).json({message:"Stock is  full of Capicity"});
//     }
//     bank.blood_groups[bloodGroupKey] += donation.units_donated;
//     console.log(`Added ${donation.units_donated} units of ${donation.blood_group} to bank ${bank.name}`);
//     donation.status = "accepted";
//     await bank.save();
//     await donation.save();
//     res.json({message:"Donation accepted"});
//   }
//   catch(err){
//     console.error("Error accepting donation:",err);
//     res.status(500).json({message:`Server error ${err}`});
//   }
// }

// exports.rejectBloodRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params; // ✅ extract actual id
//     const request = await Request.findById(requestId);

//     if (!request) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     if (request.status !== "pending") {
//       return res.status(400).json({ message: "Request already processed" });
//     }

//     request.status = "rejected";
//     await request.save();

//     res.json({ message: "Request rejected" });
//   } catch (err) {
//     console.error("Error rejecting request:", err);
//     res.status(500).json({ message: `Server error ${err}` });
//   }
// };

// exports.rejectDonation = async (req, res) => {
//   try {
//     const { donationId } = req.params; // ✅ extract actual id
//     const donation = await Donate.findById(donationId);

//     if (!donation) {
//       return res.status(404).json({ message: "Donation not found" });
//     }

//     if (donation.status !== "pending") {
//       return res.status(400).json({ message: "Donation already processed" });
//     }

//     donation.status = "rejected";
//     await donation.save();

//     res.json({ message: "Donation rejected" });
//   } catch (err) {
//     console.error("Error rejecting donation:", err);
//     res.status(500).json({ message: `Server error ${err}` });
//   }
// };

// exports.getAllBloodRequests=async(req,res)=>{
//   try{
//     const userId=req.session?.patientId;
//     console.log("Fetching requests for userId:", userId);
//     if(!userId){
      
//       return res.status(401).json({message:"User not logged in"});
//     }
//     const requests=await Request.find({user_id:userId}).populate('bank_id','name location contact');
//     if(!requests){
//       return res.status(404).json({message:"No requests found"});
//     }
//     res.json({requests});
//   }catch(err){
//     console.error("Error getting requests:",err);
//     res.status(500).json({message:`Server error ${err}`});
//   }
// }

// exports.getAllDonationRequests=async(req,res)=>{
//   try{
//     const userId=req.session?.patientId;
//     if(!userId){
//       return res.status(401).json({message:"User not logged in"});
//     }
//     const donations=await Donate.find({user_id:userId}).populate('bank_id','name location contact');
//     if(!donations){
//       return res.status(404).json({message:"No donations found"});
//     }
//     res.json({donations});
//   }catch(err){
//     console.error("Error getting donations:",err);
//     res.status(500).json({message:`Server error ${err}`});
//   }
// }   










const Request = require('../models/Request');
const Donate = require('../models/Donate');
const BloodBank = require('../models/BloodBank');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Get All Blood Requests for the Bank
const getAllBloodRequestsForBank = async (req, res) => {
    try {
        const requests = await Request.find({
            user_id: req.session.patientId
        }).populate('user_id', 'name email').sort({ requested_date: -1 });

        res.json({
            success: true,
            requests: requests || []
        });
    } catch (error) {
        console.error('Get blood requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blood requests',
            requests: []
        });
    }
};

// Get All Donation Requests for the Bank
const getAllDonationRequestsForBank = async (req, res) => {
    try {
        const donations = await Donate.find({
            user_id: req.session.patientId
        }).populate('user_id', 'name email').sort({ requested_date: -1 });

        res.json({
            success: true,
            donations: donations || []
        });
    } catch (error) {
        console.error('Get donation requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch donation requests',
            donations: []
        });
    }
};

// Accept Blood Request
const acceptBloodRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        console.log(`Accepting the Request by Id ${requestId}`);
        // Find the request
        const bloodRequest = await Request.findById(requestId);
        if (!bloodRequest) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }
        console.log(`Bank ID from session: ${req.session.bankLogin.bankId}, Request's Bank ID: ${bloodRequest.bank_id}`);

        // Check if bank owns this request
        if (bloodRequest.bank_id.toString() !== req.session.bankLogin.bankId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to handle this request'
            });
        }

        // Check if already processed
        if (bloodRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been processed'
            });
        }

        // Get bank and check stock
        const bank = await BloodBank.findById(req.session.bankLogin.bankId);
        const bloodGroupKey = bloodRequest.blood_group.replace('+', '_pos').replace('-', '_neg');
        const currentStock = bank.blood_groups[bloodGroupKey] || 0;

        if (currentStock < bloodRequest.units_requested) {
            return res.status(400).json({
                success: false,
                message: `Insufficient blood stock. Available: ${currentStock} units`
            });
        }

        // Update stock and request status
        const newStock = currentStock - bloodRequest.units_requested;
        await BloodBank.findByIdAndUpdate(req.session.bankLogin.bankId, {
            [`blood_groups.${bloodGroupKey}`]: newStock
        });

        await Request.findByIdAndUpdate(requestId, {
            status: 'accepted',
            processed_date: new Date()
        });

        // Create notification
        await new Notification({
            bankId: req.session.bankLogin.bankId,
            title: 'Blood Request Accepted',
            message: `Accepted ${bloodRequest.units_requested} units of ${bloodRequest.blood_group} blood request`,
            type: 'request_accepted',
            relatedId: requestId,
            read: false
        }).save();

        res.json({
            success: true,
            message: 'Blood request accepted successfully'
        });
    } catch (error) {
        console.error('Accept blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept blood request'
        });
    }
};

// Reject Blood Request
const rejectBloodRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        console.log(`Request to Reject Blood Request by Id ${requestId}`);
        
        const bloodRequest = await Request.findById(requestId);
        if (!bloodRequest) {
            return res.status(404).json({
                success: false,
                message: 'Blood request not found'
            });
        }

        // Check if bank owns this request
        if (bloodRequest.bank_id.toString() !== req.session.bankLogin.bankId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to handle this request'
            });
        }

        // Check if already processed
        if (bloodRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been processed'
            });
        }

        await Request.findByIdAndUpdate(requestId, {
            status: 'rejected',
            processed_date: new Date()
        });

        // Create notification
        await new Notification({
            bankId: req.session.bankLogin.bankId,
            title: 'Blood Request Rejected',
            message: `Rejected ${bloodRequest.units_requested} units of ${bloodRequest.blood_group} blood request`,
            type: 'request_rejected',
            relatedId: requestId,
            read: false
        }).save();

        res.json({
            success: true,
            message: 'Blood request rejected'
        });
    } catch (error) {
        console.error('Reject blood request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject blood request'
        });
    }
};

// Accept Donation
const acceptDonation = async (req, res) => {
    try {
        const donationId = req.params.id;
        console.log(`Accepting Donation by Id ${donationId}`);
        const donation = await Donate.findById({_id: donationId});
        console.log(`Donation : ${donation}`);
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation request not found'
            });
        }
        console.log(`Donation's Bank ID: ${donation.bank_id}, Session Bank ID: ${req.session.bankLogin.bankId}`);
        // Check if bank owns this donation
        if (donation.bank_id.toString() !== req.session.bankLogin.bankId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to handle this donation'
            });
        }

        // Check if already processed
        if (donation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Donation has already been processed'
            });
        }

        // Get bank and update stock
        const bank = await BloodBank.findById(req.session.bankLogin.bankId);
        const bloodGroupKey = donation.blood_group.replace('+', '_pos').replace('-', '_neg');
        const currentStock = bank.blood_groups[bloodGroupKey] || 0;
        
        // Check capacity
        const totalCurrentStock = Object.values(bank.blood_groups).reduce((sum, stock) => sum + stock, 0);
        if (totalCurrentStock + donation.units_donated > bank.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Blood bank capacity exceeded'
            });
        }

        const newStock = currentStock + donation.units_donated;
        await BloodBank.findByIdAndUpdate(req.session.bankLogin.bankId, {
            [`blood_groups.${bloodGroupKey}`]: newStock
        });

        await Donate.findByIdAndUpdate(donationId, {
            status: 'accepted',
            processed_date: new Date()
        });

        // Create notification
        await new Notification({
            bankId: req.session.bankLogin.bankId,
            title: 'Donation Accepted',
            message: `Accepted ${donation.units_donated} units of ${donation.blood_group} blood donation`,
            type: 'donation_accepted',
            relatedId: donationId,
            read: false
        }).save();

        res.json({
            success: true,
            message: 'Donation accepted successfully'
        });
    } catch (error) {
        console.error('Accept donation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept donation'
        });
    }
};

// Reject Donation
const rejectDonation = async (req, res) => {
    try {
        const donationId = req.params.id;
        console.log(`Rejecting Donation by Id ${donationId}`);
        const donation = await Donate.findById(donationId);
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation request not found'
            });
        }

        // Check if bank owns this donation
        if (donation.bank_id.toString() !== req.session.bankLogin.bankId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to handle this donation'
            });
        }

        // Check if already processed
        if (donation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Donation has already been processed'
            });
        }

        await Donate.findByIdAndUpdate(donationId, {
            status: 'rejected',
            processed_date: new Date()
        });

        // Create notification
        await new Notification({
            bankId: req.session.bankLogin.bankId,
            title: 'Donation Rejected',
            message: `Rejected ${donation.units_donated} units of ${donation.blood_group} blood donation`,
            type: 'donation_rejected',
            relatedId: donationId,
            read: false
        }).save();

        res.json({
            success: true,
            message: 'Donation rejected'
        });
    } catch (error) {
        console.error('Reject donation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject donation'
        });
    }
};



const getUrgentRequests = async (req, res) => {
    try {
        // Get requests from last 24 hours with high/critical urgency
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const urgentRequests = await Request.find({
            requested_date: { $gte: oneDayAgo },
            urgency: { $in: ['high', 'critical'] },
            status: 'pending'
        })
        .populate('bank_id', 'name location')
        .sort({ requested_date: -1 })
        .limit(20);
        
        // Add time ago and location info
        const formattedUrgent = urgentRequests.map(req => {
            const timeAgo = getTimeAgo(req.requested_date);
            return {
                ...req.toObject(),
                timeAgo,
                location: req.bank_id?.location || 'Unknown Location'
            };
        });
        
        res.json({
            success: true,
            urgent: formattedUrgent || []
        });
    } catch (error) {
        console.error('Get urgent requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get urgent requests',
            urgent: []
        });
    }
};

const requestDonation = async (req, res) => {
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

const donateBlood= async (req, res) =>{
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



module.exports = {
    getAllBloodRequestsForBank,
    getAllDonationRequestsForBank,
    acceptBloodRequest,
    rejectBloodRequest,
    acceptDonation,
    rejectDonation,
    getUrgentRequests,
    requestDonation,
    donateBlood
};
