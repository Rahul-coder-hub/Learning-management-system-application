const pool = require('../config/db');

exports.getSubjects = async (req, res) => {
    try {
        const [subjects] = await pool.execute('SELECT * FROM subjects');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subjects', error: error.message });
    }
};

exports.getSubjectById = async (req, res) => {
    const { subjectId } = req.params;
    try {
        const [subjects] = await pool.execute('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        if (subjects.length === 0) return res.status(404).json({ message: 'Subject not found' });
        res.json(subjects[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subject', error: error.message });
    }
};

exports.getSubjectTree = async (req, res) => {
    const { subjectId } = req.params;
    const userId = req.user.id;

    try {
        // Fetch sections
        const [sections] = await pool.execute(
            'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC',
            [subjectId]
        );

        // Fetch videos with progress/completion status for this user
        const sectionIds = sections.map(s => s.id);
        if (sectionIds.length === 0) return res.json(sections);

        const [videos] = await pool.execute(
            `SELECT v.*, vp.is_completed, vp.last_position_seconds 
             FROM videos v 
             LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
             WHERE v.section_id IN (${sectionIds.join(',')}) 
             ORDER BY v.order_index ASC`,
            [userId]
        );

        // Map videos to sections
        const tree = sections.map(section => ({
            ...section,
            lessons: videos.filter(v => v.section_id === section.id)
        }));

        res.json(tree);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subject tree', error: error.message });
    }
};
