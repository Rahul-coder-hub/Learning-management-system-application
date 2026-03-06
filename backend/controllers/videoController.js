const pool = require('../config/db');

exports.getVideoById = async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id;

    try {
        const [videos] = await pool.execute('SELECT * FROM videos WHERE id = ?', [videoId]);
        if (videos.length === 0) return res.status(404).json({ message: 'Video not found' });

        const video = videos[0];

        // Check lock status
        // A lesson is unlocked if it is the first lesson of the first section OR the previous lesson is completed.
        // For simplicity, we'll check if it's the first in the course or if the previous one is completed.

        // Find subject_id
        const [section] = await pool.execute('SELECT subject_id FROM sections WHERE id = ?', [video.section_id]);
        const subjectId = section[0].subject_id;

        // Get all videos in this subject in order
        const [allVideos] = await pool.execute(
            `SELECT v.id FROM videos v 
             JOIN sections s ON v.section_id = s.id 
             WHERE s.subject_id = ? 
             ORDER BY s.order_index ASC, v.order_index ASC`,
            [subjectId]
        );

        const videoIndex = allVideos.findIndex(v => v.id == videoId);
        let isLocked = false;

        if (videoIndex > 0) {
            const previousVideoId = allVideos[videoIndex - 1].id;
            const [progress] = await pool.execute(
                'SELECT is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
                [userId, previousVideoId]
            );
            if (progress.length === 0 || !progress[0].is_completed) {
                isLocked = true;
            }
        }

        // Get current progress
        const [currentProgress] = await pool.execute(
            'SELECT last_position_seconds, is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
            [userId, videoId]
        );

        res.json({
            ...video,
            isLocked,
            progress: currentProgress[0] || { last_position_seconds: 0, is_completed: false }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching video', error: error.message });
    }
};

exports.getFirstVideoOfSubject = async (req, res) => {
    const { subjectId } = req.params;
    try {
        const [videos] = await pool.execute(
            `SELECT v.id FROM videos v 
             JOIN sections s ON v.section_id = s.id 
             WHERE s.subject_id = ? 
             ORDER BY s.order_index ASC, v.order_index ASC LIMIT 1`,
            [subjectId]
        );
        if (videos.length === 0) return res.status(404).json({ message: 'No videos for this course' });
        res.json({ videoId: videos[0].id });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching first video', error: error.message });
    }
};
