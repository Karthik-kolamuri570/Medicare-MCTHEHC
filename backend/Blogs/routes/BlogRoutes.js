const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');
const likeController = require('../controllers/likeController.js');
const commentController = require('../controllers/commentController');


// Blog routes
router.get('/blogs', blogController.getAllBlogs);               
router.get('/blogs/search', blogController.searchBlogs);         
router.get('/blog/:id', blogController.getBlogById);            
router.post('/create-blog', blogController.createBlog);                
router.put('/update-blog/:id', blogController.updateBlog);            
router.delete('/delete-blog/:id', blogController.deleteBlog); 
router.get('/doctor/blogs', blogController.getBlogsByDoctor); 


// Like routes
router.post('/like/toggle', likeController.toggleLike);    
router.get('/like/status', likeController.checkLikeStatus); 
router.get('/patient/likes', likeController.getPatientLikedBlogs); 
router.get('/:blogId/likes', likeController.getBlogLikes); 




// Comment routes
router.post('/add-comment', commentController.addComment);             
router.get('/:blogId/comments', commentController.getBlogComments);
router.put('/update-comment/:id', commentController.updateComment);         
router.delete('/delete-comment/:id', commentController.deleteComment);        
router.patch('/comments/:id/approval', commentController.toggleCommentApproval); 


module.exports = router;
