const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const likeController = require('../controllers/likeController.js');
const commentController = require('../controllers/commentController');
const auth = require('../../middleware/auth');


// Blog routes (public)
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/search', blogController.searchBlogs);
router.get('/blog/:id', blogController.getBlogById);

// Blog routes (doctor auth required)
router.post('/create-blog', auth.doctorAuth, blogController.createBlog);
router.put('/update-blog/:id', auth.doctorAuth, blogController.updateBlog);
router.delete('/delete-blog/:id', auth.doctorAuth, blogController.deleteBlog);
router.get('/doctor/blogs', auth.doctorAuth, blogController.getBlogsByDoctor);


// Like routes (patient auth required)
router.post('/like/toggle', auth.patientAuth, likeController.toggleLike);
router.get('/like/status', auth.patientAuth, likeController.checkLikeStatus);
router.get('/patient/likes', auth.patientAuth, likeController.getPatientLikedBlogs);
router.get('/:blogId/likes', likeController.getBlogLikes);


// Comment routes (patient auth required for write operations)
router.post('/add-comment', auth.patientAuth, commentController.addComment);
router.get('/:blogId/comments', commentController.getBlogComments);
router.put('/update-comment/:id', auth.patientAuth, commentController.updateComment);
router.delete('/delete-comment/:id', auth.patientAuth, commentController.deleteComment);
router.patch('/comments/:id/approval', auth.doctorAuth, commentController.toggleCommentApproval);


module.exports = router;
