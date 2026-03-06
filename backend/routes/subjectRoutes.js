const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authenticateToken = require('../middleware/auth');

router.get('/', subjectController.getSubjects);
router.get('/:subjectId', subjectController.getSubjectById);
router.get('/:subjectId/tree', authenticateToken, subjectController.getSubjectTree);

module.exports = router;
