const db = require('../config/db');

const createOrUpdateTimesheet = async (req, res, next) => {
    try {
        const {
            user_id,
            project_id,
            day,
            hours,
            note,
            internal_note,
            conf_object_id
        } = req.body;

        // Validaciones básicas
        if (!user_id || !project_id || !day || !hours) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: user_id, project_id, day, hours'
            });
        }

        if (hours <= 0 || hours > 24) {
            return res.status(400).json({
                success: false,
                message: 'Hours must be between 0 and 24'
            });
        }

        const result = await db.query(
            'SELECT * FROM im_hours_create_timesheet($1, $2, $3, $4, $5, $6, $7)',
            [user_id, project_id, day, hours, note, internal_note, conf_object_id]
        );

        const data = result.rows[0];
        const statusCode = data.action === 'created' ? 201 : 200;

        return res.status(statusCode).json({
            success: true,
            message: data.message,
            action: data.action,
            data: {
                hour_id: data.hour_id,
                hours: data.hours,
                days: data.days
            }
        });


    } catch (error) {
        console.error('Error in createOrUpdateHour:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    createOrUpdateTimesheet
};