const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: [true, "Blog ID is required"]
    },
    patient_id: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, "Patient ID is required"]
    },
    comment_text: {
        type: String,
        required: [true, "Comment text is required"],
        minlength: [1, "Comment cannot be empty"],
        maxlength: [1000, "Comment should not exceed 1000 characters"]
    },
    is_approved: {
        type: Boolean,
        default: true
    },
    parent_comment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Comment", commentSchema);
