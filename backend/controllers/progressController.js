const pool = require('../config/db');

exports.updateProgress = async (req, res) => {
    const { videoId } = req.params;
    const { last_position_seconds, is_completed } = req.body;
    const userId = req.user.id;

    try {
        await pool.execute(
            `INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             last_position_seconds = VALUES(last_position_seconds), 
             is_completed = VALUES(is_completed)`,
            [userId, videoId, last_position_seconds, is_completed]
        );
        res.json({ message: 'Progress updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
};

exports.getSubjectProgress = async (req, res) => {
    const { subjectId } = req.params;
    const userId = req.user.id;

    try {
        const [progress] = await pool.execute(
            `SELECT vp.* 
             FROM video_progress vp 
             JOIN videos v ON vp.video_id = v.id 
             JOIN sections s ON v.section_id = s.id 
             WHERE s.subject_id = ? AND vp.user_id = ?`,
            [subjectId, userId]
        );
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
};
