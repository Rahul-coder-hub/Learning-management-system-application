const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authenticateToken = require('../middleware/auth');

router.get('/subjects/:subjectId', authenticateToken, progressController.getSubjectProgress);
router.post('/videos/:videoId', authenticateToken, progressController.updateProgress);

module.exports = router;
