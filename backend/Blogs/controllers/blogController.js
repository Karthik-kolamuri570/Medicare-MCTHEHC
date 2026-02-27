const Blog = require("./../models/Blogs");
const mongoose = require("mongoose");
const { generatePresignedUrl } = require("./../../utils/s3Config");

// Create a new blog by logged-in doctor
exports.createBlog = async (req, res) => {
  try {
    // Auth is handled by middleware — req.user is set

    const { title, description, content, image_url, tags, status } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: "Title, description and content are required" });
    }

    if (title.length < 5 || title.length > 200) {
      return res.status(400).json({ message: "Title length must be 5-200 characters" });
    }

    if (description.length < 10 || description.length > 500) {
      return res.status(400).json({ message: "Description length must be 10-500 characters" });
    }

    if (content.length < 50) {
      return res.status(400).json({ message: "Content must be at least 50 characters" });
    }

    const existingBlog = await Blog.findOne({ title: title.trim(), doctor_id: req.user._id });
    if (existingBlog) {
      return res.status(400).json({ message: "You already have a blog with this title" });
    }

    const blogData = {
      doctor_id: req.user._id,
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      image_url: image_url ? image_url.trim() : "",
      tags: Array.isArray(tags) ? tags.map(tag => tag.toLowerCase().trim()) : [],
      status: status || 'draft',
      published_at: status === 'published' ? new Date() : null
    };

    const blog = new Blog(blogData);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create blog" });
  }
};

// Get published blogs with pagination
exports.getAllBlogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 50);
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ status: 'published' })
      .populate("doctor_id", "name profileImage")
      .select("title description image_url likes_count comments_count createdAt doctor_id tags")
      .sort({ published_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ status: 'published' });

    const blogsWithSignedAvatars = await Promise.all(
      blogs.map(async (blog) => {
        const blogObj = blog.toObject();
        if (blogObj.doctor_id && blogObj.doctor_id.profileImage) {
          blogObj.doctor_id.profileImage = await generatePresignedUrl(blogObj.doctor_id.profileImage);
        }
        return blogObj;
      })
    );

    res.json({
      blogs: blogsWithSignedAvatars,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
      }
    });
  } catch (error) {
    console.error("Get all blogs error:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const blog = await Blog.findById(id).populate("doctor_id", "name profileImage bio");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.status !== 'published') {
      // Allow the author (doctor) to view their own unpublished blog
      if (!req.user || req.user._id.toString() !== blog.doctor_id._id.toString()) {
        return res.status(404).json({ message: "Blog not found" });
      }
    }
    const blogObj = blog.toObject();
    if (blogObj.doctor_id && blogObj.doctor_id.profileImage) {
      blogObj.doctor_id.profileImage = await generatePresignedUrl(blogObj.doctor_id.profileImage);
    }
    // Sign blog cover image
    if (blogObj.image_url) {
      blogObj.image_url = await generatePresignedUrl(blogObj.image_url);
    }
    res.json({
      success: true,
      data: blogObj
    });
  } catch (error) {
    console.error("Get blog by ID error:", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

// Get blogs by logged-in doctor
exports.getBlogsByDoctor = async (req, res) => {
  try {
    // Auth is handled by middleware
    const blogs = await Blog.find({ doctor_id: req.user._id })
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Get doctor blogs error:", error);
    res.status(500).json({ message: "Failed to fetch doctor's blogs" });
  }
};

// Update blog (only author)
exports.updateBlog = async (req, res) => {
  try {
    // Auth is handled by middleware
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.doctor_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const allowedFields = ["title", "description", "content", "image_url", "tags", "status"];
    allowedFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        blog[field] = req.body[field];
      }
    });

    if (req.body.status === "published" && blog.status !== "published") {
      blog.published_at = new Date();
    }

    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

// Delete blog (only author)
exports.deleteBlog = async (req, res) => {
  try {
    // Auth is handled by middleware
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.doctor_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

// Search blogs by query and tags
exports.searchBlogs = async (req, res) => {
  try {
    const { query, tags } = req.query;
    let filter = { status: 'published' };

    if (query) {
      filter.$or = [
        { title: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { content: new RegExp(query, 'i') }
      ];
    }

    if (tags) {
      const tagList = tags.split(",").map(t => t.trim().toLowerCase());
      filter.tags = { $in: tagList };
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 10), 50);
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .populate("doctor_id", "name email")
      .sort({ published_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    const blogsWithSignedUrls = await Promise.all(
      blogs.map(async (blog) => {
        const blogObj = blog.toObject();
        // Sign author profile image
        if (blogObj.doctor_id && blogObj.doctor_id.profileImage) {
          blogObj.doctor_id.profileImage = await generatePresignedUrl(blogObj.doctor_id.profileImage);
        }
        // Sign blog cover image
        if (blogObj.image_url) {
          blogObj.image_url = await generatePresignedUrl(blogObj.image_url);
        }
        return blogObj;
      })
    );

    res.json({
      blogs: blogsWithSignedUrls,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
      }
    });
  } catch (error) {
    console.error("Search blogs error:", error);
    res.status(500).json({ message: "Failed to search blogs" });
  }
};
