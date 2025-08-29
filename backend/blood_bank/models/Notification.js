const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    bankId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['request_received', 'donation_received', 'request_accepted', 'request_rejected', 
               'donation_accepted', 'donation_rejected', 'low_stock', 'system'],
        default: 'system'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    },
    read: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);
