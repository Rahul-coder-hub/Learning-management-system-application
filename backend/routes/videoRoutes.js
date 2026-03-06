const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authenticateToken = require('../middleware/auth');

router.get('/:videoId', authenticateToken, videoController.getVideoById);
// This is used for "Start Learning"
router.get('/subjects/:subjectId/first-video', authenticateToken, videoController.getFirstVideoOfSubject);

module.exports = router;
