

const mongoose = require('mongoose');

const TimingSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true 
  },
  start_time: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Validate format HH:mm, 24-hour clock
        return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid HH:mm start_time`
    }
  },
  end_time: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Check format
        if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v)) return false;
        // Ensure end_time is after start_time
        if (this.start_time) {
          const [sh, sm] = this.start_time.split(':').map(Number);
          const [eh, em] = v.split(':').map(Number);
          if (eh < sh || (eh === sh && em <= sm)) {
            return false;
          }
        }
        return true;
      },
      message: props => `${props.value} must be later than start_time`
    }
  }
}, { _id: false });

const BloodCampSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Doctor", 
    required: true 
  },
  location: {
    address: { type: String, required: true },
    city: String,
    state: String,
    country: String,
    pincode: String,
    geo: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 }
    }
  },
  start_date: { 
    type: Date,
    required: true 
  },
  end_date: { 
    type: Date,
    validate: {
      validator: function(v) {
        if (v && this.start_date) return v >= this.start_date;
        return true;
      },
      message: 'End date must be equal or greater than start date'
    }
  },
  timings: {
    type: [TimingSchema],
    default: [],
    validate: {
      validator: function(v) {
        // Each timing date must be inside start_date and end_date
        if (!this.start_date) return false;
        return v.every(t => {
          const d = new Date(t.date);
          const afterStart = d >= this.start_date;
          const beforeEnd = this.end_date ? d <= this.end_date : true;
          return afterStart && beforeEnd;
        });
      },
      message: 'All timing dates must lie between start_date and end_date'
    }
  },
  blood_bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodBank"
  },
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  }],
  donations: [{
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  blood_group: String,
  units: Number,
  donation_time: Date,
  verified: { type: Boolean, default: false }
}],

  contact_phone: String,
  contact_email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  description: String,
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodCamp', BloodCampSchema);
