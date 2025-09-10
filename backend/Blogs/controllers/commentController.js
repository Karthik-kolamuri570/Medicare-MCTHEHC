const Comment = require("../models/Comment");
const Blog = require("../models/Blogs");
const mongoose = require("mongoose");

// Add a comment
exports.addComment = async (req, res) => {
  try {
    if (!req.session || !req.session.patientId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { blog_id, comment_text, parent_comment_id } = req.body;
    if (!blog_id || !comment_text) {
      return res.status(400).json({ message: "Blog ID and comment text required" });
    }
    if (!mongoose.Types.ObjectId.isValid(blog_id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    if (parent_comment_id && !mongoose.Types.ObjectId.isValid(parent_comment_id)) {
      return res.status(400).json({ message: "Invalid parent comment ID" });
    }
    const blog = await Blog.findById(blog_id);
    if (!blog || blog.status !== 'published') {
      return res.status(404).json({ message: "Blog not found or unpublished" });
    }
    const commentData = {
      blog_id,
      patient_id: req.session.patientId,
      comment_text: comment_text.trim(),
      parent_comment_id: parent_comment_id || null,
      is_approved: true
    };
    const comment = new Comment(commentData);
    await comment.save();
    await Blog.findByIdAndUpdate(blog_id, { $inc: { comments_count: 1 } });
    await comment.populate("patient_id", "name");
    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get comments for a blog with replies
exports.getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 50);
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ blog_id: blogId, is_approved: true, parent_comment_id: null })
      .populate("patient_id", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ blog_id: blogId, is_approved: true, parent_comment_id: null });

    const commentsWithReplies = await Promise.all(comments.map(async comment => {
      const replies = await Comment.find({ parent_comment_id: comment._id, is_approved: true })
        .populate("patient_id", "name")
        .sort({ createdAt: 1 })
        .limit(10);
      return { ...comment.toObject(), replies };
    }));

    res.json({
      comments: commentsWithReplies,
      pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalComments: total }
    });
  } catch (error) {
    console.error("Get blog comments error:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// Update comment (patient only)
exports.updateComment = async (req, res) => {
  try {
    if (!req.session || !req.session.patientId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    const { comment_text } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.patient_id.toString() !== req.session.patientId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!comment_text || comment_text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }
    comment.comment_text = comment_text.trim();
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({ message: "Failed to update comment" });
  }
};

// Delete comment (patient only)
exports.deleteComment = async (req, res) => {
  try {
    if (!req.session || !req.session.patientId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.patient_id.toString() !== req.session.patientId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Comment.deleteMany({ parent_comment_id: id }); // Delete replies
    await Comment.findByIdAndDelete(id);
    await Blog.findByIdAndUpdate(comment.blog_id, { $inc: { comments_count: -1 } });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

// Approve/disapprove comment (doctor/admin only)
exports.toggleCommentApproval = async (req, res) => {
  try {
    if (!req.session || !req.session.doctorId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.is_approved = !comment.is_approved;
    await comment.save();

    await Blog.findByIdAndUpdate(comment.blog_id, { $inc: { comments_count: comment.is_approved ? 1 : -1 } });
    res.json({ message: `Comment ${comment.is_approved ? "approved" : "disapproved"}`, comment });
  } catch (error) {
    console.error("Toggle comment approval error:", error);
    res.status(500).json({ message: "Failed to toggle comment approval" });
  }
};
