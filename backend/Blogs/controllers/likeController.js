const Like = require("../models/Like");
const Blog = require("../models/Blogs");
const mongoose = require("mongoose");

// Toggle like for logged-in patient
exports.toggleLike = async (req, res) => {
  try {
    if (!req.session || !req.session.patientId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { blog_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(blog_id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const patient_id = req.session.patientId;

    const blog = await Blog.findById(blog_id);
    if (!blog || blog.status !== 'published') {
      return res.status(404).json({ message: "Blog not found or unpublished" });
    }

    const existing = await Like.findOne({ blog_id, patient_id });
    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      await Blog.findByIdAndUpdate(blog_id, { $inc: { likes_count: -1 } });
      return res.json({ message: "Like removed", isLiked: false });
    } else {
      const like = new Like({ blog_id, patient_id });
      await like.save();
      await Blog.findByIdAndUpdate(blog_id, { $inc: { likes_count: 1 } });
      return res.status(201).json({ message: "Like added", isLiked: true });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

// Check like status for logged-in patient
exports.checkLikeStatus = async (req, res) => {
  try {
    const { blog_id } = req.query;
    if (!blog_id || !mongoose.Types.ObjectId.isValid(blog_id)) {
      return res.status(400).json({ message: "Invalid or missing blog ID" });
    }
    if (!req.session || !req.session.patientId) {
      return res.json({ isLiked: false });
    }
    const patient_id = req.session.patientId;
    const like = await Like.findOne({ blog_id, patient_id });
    res.json({ isLiked: Boolean(like) });
  } catch (error) {
    console.error("Check like status error:", error);
    res.status(500).json({ message: "Failed to check like status" });
  }
};

// Get likes for a blog
exports.getBlogLikes = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const likes = await Like.find({ blog_id: blogId }).populate("patient_id", "name").sort({ createdAt: -1 });
    res.json({ likes, count: likes.length });
  } catch (error) {
    console.error("Get blog likes error:", error);
    res.status(500).json({ message: "Failed to fetch likes" });
  }
};

// Get liked blogs for logged-in patient
exports.getPatientLikedBlogs = async (req, res) => {
  try {
    if (!req.session || !req.session.patientId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const patient_id = req.session.patientId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 50);
    const skip = (page - 1) * limit;

    const likes = await Like.find({ patient_id })
      .populate({
        path: "blog_id",
        match: { status: "published" },
        populate: { path: "doctor_id", select: "name profileImage" }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Like.countDocuments({ patient_id });
    const filteredLikes = likes.filter(l => l.blog_id !== null);

    res.json({
      likedBlogs: filteredLikes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLikedBlogs: total
      }
    });
  } catch (error) {
    console.error("Get patient liked blogs error:", error);
    res.status(500).json({ message: "Failed to fetch liked blogs" });
  }
};
