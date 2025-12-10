const db = require('../config/db');

// const createOrUpdateTimesheet2 = async (req, res, next) => {
//     try {
//         const {
//             user_id,
//             project_id,
//             day,
//             hours,
//             note,
//             internal_note,
//             conf_object_id
//         } = req.body;

//         // Validaciones básicas
//         if (!user_id || !project_id || !day || !hours) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Missing required fields: user_id, project_id, day, hours'
//             });
//         }

//         if (hours <= 0 || hours > 24) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Hours must be between 0 and 24'
//             });
//         }

//         const result = await db.query(
//             'SELECT * FROM im_hours_create_timesheet($1, $2, $3, $4, $5, $6, $7)',
//             [user_id, project_id, day, hours, note, internal_note, conf_object_id]
//         );

//         const data = result.rows[0];
//         const statusCode = data.action === 'created' ? 201 : 200;

//         return res.status(statusCode).json({
//             success: true,
//             message: data.message,
//             action: data.action,
//             data: {
//                 hour_id: data.hour_id,
//                 hours: data.hours,
//                 days: data.days
//             }
//         });


//     } catch (error) {
//         console.error('Error in createOrUpdateHour:', error);

//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// }
const createOrUpdateTimesheet = async (req, res, next) => {
    try {
        const items = Array.isArray(req.body) ? req.body : [req.body];
        const results = [];

        for (const item of items) {
            const {
                user_id,
                project_id,
                day,
                hours,
                note,
                internal_note,
                conf_object_id
            } = item;

            // Validaciones
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
            results.push({
                action: data.action,
                message: data.message,
                hour_id: data.hour_id,
                hours: data.hours,
                days: data.days
            });
        }

        return res.status(200).json({
            success: true,
            total: results.length,
            data: results
        });

    } catch (error) {
        console.error('Error in createOrUpdateHour:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


const getUserTicketsWithHours = async (req, res) => {
  try {
    const { userId } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0]; // Default: hoy

    // Validaciones
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID es requerido'
      });
    }

    // Query con JOIN a im_projects y LEFT JOIN a im_hours
    const query = `
      SELECT 
        t.ticket_id,
        p.project_name,
        t.ticket_status_id,
        t.ticket_prio_id,
        t.ticket_creation_date,
        t.ticket_assignee_id,
        h.hour_id,
        h.hours,
        h.note,
        h.day
      FROM im_tickets t
      INNER JOIN im_projects p 
        ON t.ticket_id = p.project_id
      LEFT JOIN im_hours h 
        ON t.ticket_id = h.project_id 
        AND h.day = $2
        AND h.user_id = $1
      WHERE t.ticket_assignee_id = $1
        AND t.ticket_status_id NOT IN (30001)
      ORDER BY t.ticket_creation_date DESC
    `;

    // Ejecutar query
    const result = await db.query(query, [userId, date]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No se encontraron tickets asignados',
        total: 0,
        date: date
      });
    }

    // Mapear resultados
    const ticketsWithHours = result.rows.map(row => ({
      ticket_id: row.ticket_id,
      project_name: row.project_name,
      ticket_status_id: row.ticket_status_id,
      ticket_prio_id: row.ticket_prio_id,
      creation_date: row.creation_date,
      ticket_assignee_id: row.ticket_assignee_id,
      hours_data: row.hour_id ? {
        hour_id: row.hour_id,
        hours: row.hours,
        note: row.note || '',
        day: row.day
      } : null
    }));

    return res.json({
      success: true,
      data: ticketsWithHours,
      total: ticketsWithHours.length,
      date: date,
      message: 'Tickets con horas obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error en getUserTicketsWithHours:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tickets con horas',
      error: error.message
    });
  }
};

const deleteTimesheet = async (req, res, next) => {
    try {
        const { user_id, project_id, day } = req.body;

        // Validaciones
        if (!user_id || !project_id || !day) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: user_id, project_id, day'
            });
        }

        // Validar formato de fecha (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(day)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Expected YYYY-MM-DD'
            });
        }

        // Ejecutar DELETE y capturar el registro eliminado
        const result = await db.query(
            `DELETE FROM im_hours 
             WHERE user_id = $1 
               AND project_id = $2 
               AND day = $3 
             RETURNING hour_id, hours, days`,
            [user_id, project_id, day]
        );

        // Verificar si se eliminó algo
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No timesheet record found for the specified user, project and date'
            });
        }

        const deletedRecord = result.rows[0];

        // Recalcular totales del proyecto (igual que en create/update)
        const totalsResult = await db.query(
            `WITH RECURSIVE project_hierarchy AS (
                SELECT project_id
                FROM im_projects
                WHERE project_id = $1
                UNION ALL
                SELECT p.project_id
                FROM im_projects p
                INNER JOIN project_hierarchy ph ON p.parent_id = ph.project_id
            )
            SELECT 
                COALESCE(SUM(h.hours), 0) as total_hours,
                COALESCE(SUM(h.days), 0) as total_days
            FROM im_hours h
            WHERE h.project_id IN (SELECT project_id FROM project_hierarchy)`,
            [project_id]
        );

        const { total_hours, total_days } = totalsResult.rows[0];

        // Actualizar cache del proyecto
        await db.query(
            `UPDATE im_projects
             SET reported_hours_cache = $1,
                 reported_days_cache = $2
             WHERE project_id = $3`,
            [total_hours, total_days, project_id]
        );

        // Respuesta exitosa
        return res.status(200).json({
            success: true,
            message: 'Timesheet record deleted successfully',
            data: {
                hour_id: deletedRecord.hour_id,
                deleted_hours: deletedRecord.hours,
                deleted_days: deletedRecord.days,
                project_totals: {
                    total_hours: parseFloat(total_hours),
                    total_days: parseFloat(total_days)
                }
            }
        });

    } catch (error) {
        console.error('Error in deleteTimesheet:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const getSupportTicketsWithHours = async (req, res) => {
  try {
    const { userId } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    // Validación
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID es requerido'
      });
    }

    // Query usando acs_rels para obtener tickets como miembro de apoyo
    const query = `
      SELECT 
        t.ticket_id,
        p.project_name,
        t.ticket_status_id,
        t.ticket_prio_id,
        t.ticket_creation_date,
        t.ticket_assignee_id,
        h.hour_id,
        h.hours,
        h.note,
        h.day
      FROM acs_rels r
      INNER JOIN im_tickets t 
        ON r.object_id_one = t.ticket_id
      INNER JOIN im_projects p 
        ON t.ticket_id = p.project_id
      LEFT JOIN im_hours h
        ON t.ticket_id = h.project_id
        AND h.day = $2
        AND h.user_id = $1
      WHERE r.object_id_two = $1
        AND t.ticket_assignee_id <> $1
        AND t.ticket_status_id NOT IN (30001)
      ORDER BY t.ticket_creation_date DESC
    `;

    const result = await db.query(query, [userId, date]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No se encontraron tickets de apoyo',
        total: 0,
        date: date
      });
    }

    // Mapear datos igual que tu otra función
    const ticketsWithHours = result.rows.map(row => ({
      ticket_id: row.ticket_id,
      project_name: row.project_name,
      ticket_status_id: row.ticket_status_id,
      ticket_prio_id: row.ticket_prio_id,
      creation_date: row.ticket_creation_date,
      ticket_assignee_id: row.ticket_assignee_id,
      hours_data: row.hour_id ? {
        hour_id: row.hour_id,
        hours: row.hours,
        note: row.note || '',
        day: row.day
      } : null
    }));

    return res.json({
      success: true,
      data: ticketsWithHours,
      total: ticketsWithHours.length,
      date: date,
      message: 'Tickets de apoyo obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error en getSupportTicketsWithHours:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tickets de apoyo',
      error: error.message
    });
  }
};

const getUserHoursSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID es requerido"
      });
    }

    // Horas normales
    const normalResult = await db.query(
      `
        SELECT h.hours
        FROM im_hours h
        INNER JOIN im_tickets t
          ON h.project_id = t.ticket_id
        WHERE h.user_id = $1
          AND h.day = $2
          AND t.ticket_assignee_id = $1
          AND t.ticket_status_id NOT IN (30001)
      `,
      [userId, date]
    );

    // Horas de apoyo
    const supportResult = await db.query(
      `
        SELECT h.hours
        FROM im_hours h
        INNER JOIN im_tickets t
          ON h.project_id = t.ticket_id
        INNER JOIN acs_rels r
          ON r.object_id_one = t.ticket_id
        WHERE h.user_id = $1
          AND h.day = $2
          AND r.object_id_two = $1
          AND t.ticket_assignee_id <> $1
          AND t.ticket_status_id NOT IN (30001)
      `,
      [userId, date]
    );

    // Suma normal
    const normal_hours = normalResult.rows.reduce(
      (sum, r) => sum + Number(r.hours || 0),
      0
    );

    // Suma apoyo
    const support_hours = supportResult.rows.reduce(
      (sum, r) => sum + Number(r.hours || 0),
      0
    );

    const total_hours = normal_hours + support_hours;

    return res.json({
      success: true,
      date,
      total_hours,
      normal_hours,
      support_hours
    });

  } catch (error) {
    console.error("Error en getUserHoursSummary:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener resumen de horas",
      error: error.message
    });
  }
};


module.exports = {
    createOrUpdateTimesheet,
    getUserTicketsWithHours,
    deleteTimesheet,
    getSupportTicketsWithHours,
    getUserHoursSummary
};