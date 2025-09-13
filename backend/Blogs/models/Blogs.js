const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    doctor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, "Doctor ID is required"]
    },
    title: {
        type: String,
        required: [true, "Blog title is required"],
        minlength: [20, "Title should be at least 5 characters"],
        maxlength: [50, "Title should not exceed 200 characters"]
    },
    description: {
        type: String,
        required: [true, "Blog description is required"],
        minlength: [100, "Description should be at least 100 characters"],
        maxlength: [180, "Description should not exceed 180 characters"]
    },
    content: {
        type: String,
        required: [true, "Blog content is required"],
        minlength: [50, "Content should be at least 50 characters"]
    },
    image_url: {
        type: String,
        default: ""
    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'archived'],
            message: "Status should be either draft, published or archived"
        },
        default: 'draft'
    },
    likes_count: {
        type: Number,
        default: 0,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: "Likes count should be greater than or equal to 0"
        }
    },
    comments_count: {
        type: Number,
        default: 0,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: "Comments count should be greater than or equal to 0"
        }
    },
    published_at: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);
