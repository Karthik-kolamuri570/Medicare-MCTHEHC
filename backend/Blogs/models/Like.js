const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: [true, "Blog ID is required"]
    },
    patient_id: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, "Patient ID is required"]
    }
}, {
    timestamps: true
});

// Prevent duplicate likes from same patient on same blog
likeSchema.index({ blog_id: 1, patient_id: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
